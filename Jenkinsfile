pipeline {
    agent any

    environment {
        // AI Geliştirme Sunucuları (VPN/Yerel Ağ Uç Noktaları)
        AGENT_DEV01 = "http://172.16.1.101:4096"
        AGENT_DEV02 = "http://172.16.1.102:4096"
        
        // Jenkins sunucusunda (172.16.1.21) opencode ve dil araçlarının PATH tanımı
        PATH = "/usr/local/bin:/var/lib/jenkins/.opencode/bin:${env.PATH}"
    }

    stages {
        stage('Teknoloji Tespiti ve Testler') {
            steps {
                script {
                    echo "🔍 Aktif Branch: ${env.BRANCH_NAME}"
                    
                    // Çıktıları hata anında ajana gönderebilmek için log dosyasına yönlendiriyoruz
                    sh '''
                        set -e
                        set -o pipefail

                        if [ -f "package.json" ]; then
                            echo "📦 Node.js / JavaScript projesi tespit edildi."
                            npm ci 2>&1 | tee build_error.log
                            
                            # package.json içinde lint scripti varsa çalıştır
                            if grep -q '"lint"' package.json; then
                                npm run lint 2>&1 | tee -a build_error.log
                            fi
                            
                            # package.json içinde test scripti varsa çalıştır
                            if grep -q '"test"' package.json; then
                                npm test 2>&1 | tee -a build_error.log
                            fi

                        elif [ -f "requirements.txt" ] || [ -f "pyproject.toml" ]; then
                            echo "🐍 Python projesi tespit edildi."
                            python3 -m venv .venv
                            . .venv/bin/activate
                            if [ -f "requirements.txt" ]; then pip install -r requirements.txt 2>&1 | tee build_error.log; fi
                            pytest 2>&1 | tee -a build_error.log

                        elif [ -f "composer.json" ]; then
                            echo "🐘 PHP projesi tespit edildi."
                            composer install --no-interaction 2>&1 | tee build_error.log
                            ./vendor/bin/phpunit 2>&1 | tee -a build_error.log

                        else
                            echo "🌐 Saf HTML/JS veya özel proje yapısı tespit edildi. Temel sözdizimi kontrolü yapılıyor..."
                            find . -name "*.js" -not -path "*/.*" -exec node --check {} + 2>&1 | tee build_error.log
                        fi
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "✅ ${env.BRANCH_NAME} dalındaki tüm kontroller başarıyla tamamlandı!"
        }

        failure {
            script {
                echo "❌ Derleme veya test başarısız oldu! Sorumlu AI ajanına geri bildirim hazırlanıyor..."

                // Branch ismine göre hedef sunucu IP ve portunu belirle
                def targetUrl = ""
                if (env.BRANCH_NAME.contains("dev01") || env.BRANCH_NAME.contains("backend")) {
                    targetUrl = env.AGENT_DEV01
                } else if (env.BRANCH_NAME.contains("dev02") || env.BRANCH_NAME.contains("frontend")) {
                    targetUrl = env.AGENT_DEV02
                }

                if (targetUrl != "") {
                    // Hata logunun son 60 satırını güvenli şekilde al
                    def errorLog = ""
                    if (fileExists('build_error.log')) {
                        errorLog = sh(script: "tail -n 60 build_error.log", returnStdout: true).trim()
                    } else {
                        errorLog = "Log dosyası oluşmadı; Jenkins konsol çıktısını kontrol edin (Build #${env.BUILD_NUMBER})."
                    }

                    // Hata logunu geçici bir prompt dosyasına yaz (tırnak/kaçış karakteri hatalarını önlemek için)
                    writeFile file: 'agent_prompt.txt', text: """Jenkins CI/CD pipeline (${env.BRANCH_NAME} - Build #${env.BUILD_NUMBER}) başarısız oldu.
Lütfen aşağıdaki hata çıktısını incele, kök nedeni bul, kodu düzelt ve yerel testleri doğruladıktan sonra değişikliği tekrar pushla.
(Not: Üst üste 2 denemede hata çözülmezse dur ve durumu bildir.)

--- HATA LOGU ---
${errorLog}
"""

                    // Hedef sunucudaki OpenCode servisine hatayı ilet
                    sh """
                        PROMPT_CONTENT=\$(cat agent_prompt.txt)
                        opencode run --attach ${targetUrl} "\$PROMPT_CONTENT"
                    """
                } else {
                    echo "⚠️ '${env.BRANCH_NAME}' dalı 'dev01/backend' veya 'dev02/frontend' anahtar kelimelerini içermediği için bildirim atlanıyor."
                }
            }
        }

        always {
            // Çalışma dizinindeki geçici log ve sanal ortam kalıntılarını temizle
            sh 'rm -rf build_error.log agent_prompt.txt .venv'
        }
    }
}
