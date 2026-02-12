@echo off
echo Configurando Java 17...
set JAVA_HOME=C:\Program Files\Microsoft\jdk-17.0.18.8-hotspot
set PATH=%JAVA_HOME%\bin;%PATH%

echo Configurando Android SDK...
set ANDROID_HOME=C:\Users\Shockwave\AppData\Local\Android\Sdk
set PATH=%ANDROID_HOME%\platform-tools;%PATH%

echo Verificando Java...
java -version

echo.
echo Iniciando build Android...
npx expo run:android
