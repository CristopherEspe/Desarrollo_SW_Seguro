@echo off
pushd %~dp0
set rootpath=%CD%
popd

cd %rootpath%\backend
set auth_service_path=%CD%\msvc-auth
set gateway_service_path=%CD%\msvc-gateway
set eureka_service_path=%CD%\msvc-registry
set users_service_path=%CD%\msvc-users
set courses_service_path=%CD%\msvc-courses

chmod +x %auth_service_path%\build.cmd
chmod +x %gateway_service_path%\build.cmd
chmod +x %eureka_service_path%\build.cmd
chmod +x %users_service_path%\build.cmd
chmod +x %courses_service_path%\build.cmd

echo "Building backend services"

echo "Building auth service"
cd %auth_service_path%
@Call build.cmd

echo "Building gateway service"
cd %gateway_service_path%
@Call build.cmd

echo "Building eureka service"
cd %eureka_service_path%
@Call build.cmd

echo "Building users service"
cd %users_service_path%
@Call build.cmd

echo "Building courses service"
cd %courses_service_path%
@Call build.cmd

echo "Backend services build completed"
cd %rootpath%