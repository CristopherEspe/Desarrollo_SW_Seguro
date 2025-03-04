@echo off
pushd %~dp0
set rootpath=%CD%
popd

REM mvn -DskipTests clean package && mkdir ./target/release 2> NUL && copy "./target/*.jar" "./target/release/application.jar"
REM mvn -DskipTests clean package

@Call mvn.cmd -DskipTests clean package

timeout /t 1 /nobreak > NUL
mkdir "%rootpath%/release" 2> NUL

echo "Copying jar file to release folder"

for %%f in ("%rootpath%\target\*.jar") do (
    copy /Y "%%f" "%rootpath%\release\application.jar"
)

echo "Build completed"
