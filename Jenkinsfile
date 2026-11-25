pipeline {
    agent any

    environment {
        // Sunucu IP ve Port Haritası
        DEV01_URL = "http://172.16.1.101:4096"
        DEV02_URL = "http://172.16.1.102:4096"
        // Jenkins sunucusunda opencode CLI yolunu tanımlayın
        PATH = "/usr/local/bin:/var/lib/jenkins/.opencode/bin:${env.PATH}"
    }

    stages {
        stage('Hazırlık ve Bağımlılıklar') {
            steps {
                echo "Aktif Branch: ${env.BRANCH_NAME}"
                sh 'npm ci'
            }
        }

        stage('Kod Kalitesi (Lint & Typecheck)') {
            steps {
                // Çıktıyı bir dosyaya kaydediyoruz ki hata olursa ajana gönderebilelim
                sh 'npm run lint > build_error.log 2>&1'
            }
        }

        stage('Otomatik Testler') {
            steps {
                sh 'npm test >> build_error.log 2>&1'
            }
        }
    }

    post {
        success {
            echo "✅ ${env.BRANCH_NAME} üzerindeki tüm testler başarıyla geçti!"
            // İsteğe bağlı: Başarı bildirimini ilgili ajana iletebilirsiniz
        }

        failure {
            script {
                echo "❌ Test veya Lint hatası tespit edildi! İlgili AI ajanına geri bildirim gönderiliyor..."
                
                // Branch adına göre hangi sunucunun sorumlu olduğunu belirle
                def targetAgentUrl = ""
                if (env.BRANCH_NAME.contains("dev01") || env.BRANCH_NAME.contains("backend")) {
                    targetAgentUrl = env.DEV01_URL
                } else if (env.BRANCH_NAME.contains("dev02") || env.BRANCH_NAME.contains("frontend")) {
                    targetAgentUrl = env.DEV02_URL
                }

                if (targetAgentUrl != "") {
                    // Hata logunun son 50 satırını al
                    def errorSnippet = sh(script: "tail -n 50 build_error.log", returnStdout: true).trim()
                    
                    // OpenCode servisine hatayı düzeltme görevi gönder
                    sh """
                        opencode run --attach ${targetAgentUrl} "Jenkins CI/CD pipeline (${env.BRANCH_NAME}) başarısız oldu. Aşağıdaki hata logunu incele, hatayı düzelt, testleri yerel olarak doğrula ve tekrar pushla:\n\n${errorSnippet}"
                    """
                } else {
                    echo "Bu branch için eşleşen bir AI sunucusu bulunamadı."
                }
            }
        }

        always {
            // Geçici log dosyasını temizle
            sh 'rm -f build_error.log'
        }
    }
}
