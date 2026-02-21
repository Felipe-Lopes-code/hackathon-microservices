@echo off
REM Script de Execução de Testes de Segurança e Performance
REM EduShare - Plataforma de Materiais Didáticos

echo ==============================================
echo   🔒 AUDITORIA DE SEGURANÇA E PERFORMANCE
echo   EduShare - Plataforma de Materiais Didáticos
echo ==============================================
echo.

REM Verificar se os serviços estão rodando
echo [1/5] Verificando serviços...
curl -s http://localhost:3000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ API Gateway está rodando
) else (
    echo ✗ API Gateway não está rodando
    echo ⚠ Execute: docker-compose up -d
    exit /b 1
)

curl -s http://localhost:3001/api/auth/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Auth Service está rodando
) else (
    echo ⚠ Auth Service não está respondendo
)
echo.

REM Instalar dependências se necessário
echo [2/5] Verificando dependências de teste...
cd tests
if not exist "node_modules" (
    echo Instalando dependências...
    call npm install
) else (
    echo ✓ Dependências já instaladas
)
echo.

REM Executar testes de segurança
echo [3/5] Executando testes de segurança...
echo ----------------------------------------------
call npm run test:security
set SECURITY_EXIT=%errorlevel%
echo.

REM Executar testes de performance
echo [4/5] Executando testes de performance...
echo ----------------------------------------------
call npm run test:performance
set PERFORMANCE_EXIT=%errorlevel%
echo.

REM Executar load testing
echo [5/5] Executando load testing...
echo ----------------------------------------------
node performance.test.js
set LOAD_EXIT=%errorlevel%
echo.

REM Resumo dos resultados
echo ==============================================
echo   📊 RESUMO DOS RESULTADOS
echo ==============================================
echo.

if %SECURITY_EXIT% equ 0 (
    echo ✓ Testes de Segurança: PASSOU
) else (
    echo ✗ Testes de Segurança: FALHOU
)

if %PERFORMANCE_EXIT% equ 0 (
    echo ✓ Testes de Performance: PASSOU
) else (
    echo ✗ Testes de Performance: FALHOU
)

if %LOAD_EXIT% equ 0 (
    echo ✓ Load Testing: PASSOU
) else (
    echo ✗ Load Testing: FALHOU
)

echo.
echo ----------------------------------------------
echo Relatórios gerados:
echo   - performance-report.json
echo   - coverage/ (se disponível)
echo.
echo Documentação:
echo   - AUDIT_REPORT.md (relatório completo)
echo   - AUDIT_SUMMARY.md (resumo executivo)
echo   - TEST_GUIDE.md (guia de testes)
echo ==============================================
echo.

REM Exit code final
if %SECURITY_EXIT% equ 0 if %PERFORMANCE_EXIT% equ 0 if %LOAD_EXIT% equ 0 (
    echo ✅ TODOS OS TESTES PASSARAM
    exit /b 0
) else (
    echo ❌ ALGUNS TESTES FALHARAM
    exit /b 1
)
