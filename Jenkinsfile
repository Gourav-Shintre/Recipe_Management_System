pipeline {
    agent { label 'windows' }
    environment {
        DOTNET_SDK_VERSION = '8.0'
        TEST_IDENTITY_SERVICE = false
        TEST_STOREMANAGEMENT_SERVICE = false 
    }
    
    tools {
        jdk 'JDK-17'
        gradle 'Gradle-8.4'
        nodejs 'NodeJS_20.13.1'
    }

    stages {


	stage('Restore') {
            steps {
                dir('epam.recipe-main') {
                    bat 'dotnet restore Epm.Recipe.sln'
                }
            }
        }
        stage('Build') {
            steps {
                dir('epam.recipe-main') {
		    echo 'Building Recipe Service Module..'
                    bat 'dotnet build Epm.Recipe.sln --configuration Release'
                }
            }
        }

        stage('Test') {
            steps {
                dir('epam.recipe-main') {
                    bat 'FOR /R %%G IN (TestResults) DO IF EXIST "%%G" RMDIR /S /Q "%%G"'
                    bat 'dotnet test Epm.Recipe.sln --collect:"XPlat Code Coverage" -- DataCollectionRunSettings.DataCollectors.DataCollector.Configuration.Format=opencover' 
                }
            }
        }

        stage('Building Recipe Platform UI') {
            steps {
                dir('recipe_ui') {
                    echo 'Building Recipe Plaform UI Module..'
                    bat 'npm install'
                    bat 'npm run build'                    
                    }
            }
        }
            
            stage('Test Recipe Platform UI') {
            steps {
                dir('recipe_ui') {
                    echo 'Testing Recipe UI Module..'
                    bat 'npm run test'                     
                    }
                }
            }

       stage('Build Recipe QA') {
            steps {
                dir('recipie_qa') {
                    echo 'Building Recipe QA Module..'                    
                    bat './gradlew.bat clean build test'
                    }
            } 
        }

        
        stage('SonarQube analysis') {
            steps {
                script {
                    def scannerHome = tool 'SonarQube Scanner'
                    withSonarQubeEnv('SonarHyd') {
                        bat "${scannerHome}/bin/sonar-scanner.bat"
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                 timeout(time:5, unit:'MINUTES'){
                def qualityGateCheck = waitForQualityGate()
                if (qualityGateCheck.status != 'OK') {
                    currentBuild.result = 'FAILURE'
                    error "Pipeline aborted due to quality gate failure :: ${qualityGateCheck.status}"
                }
                 }
            }
        }
    }
}
