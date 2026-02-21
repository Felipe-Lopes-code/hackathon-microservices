#!/bin/bash

# Script de Execução de Testes de Segurança e Performance
# EduShare - Plataforma de Materiais Didáticos

echo "=============================================="
echo "  🔒 AUDITORIA DE SEGURANÇA E PERFORMANCE"
echo "  EduShare - Plataforma de Materiais Didáticos"
echo "=============================================="
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar se os serviços estão rodando
echo -e "${BLUE}[1/5]${NC} Verificando serviços..."
if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} API Gateway está rodando"
else
    echo -e "${RED}✗${NC} API Gateway não está rodando"
    echo -e "${YELLOW}Execute: docker-compose up -d${NC}"
    exit 1
fi

if curl -s http://localhost:3001/api/auth/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Auth Service está rodando"
else
    echo -e "${YELLOW}⚠${NC} Auth Service não está respondendo"
fi

echo ""

# Instalar dependências se necessário
echo -e "${BLUE}[2/5]${NC} Verificando dependências de teste..."
cd tests
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Instalando dependências...${NC}"
    npm install
else
    echo -e "${GREEN}✓${NC} Dependências já instaladas"
fi
echo ""

# Executar testes de segurança
echo -e "${BLUE}[3/5]${NC} Executando testes de segurança..."
echo "----------------------------------------------"
npm run test:security
SECURITY_EXIT=$?
echo ""

# Executar testes de performance
echo -e "${BLUE}[4/5]${NC} Executando testes de performance..."
echo "----------------------------------------------"
npm run test:performance
PERFORMANCE_EXIT=$?
echo ""

# Executar load testing
echo -e "${BLUE}[5/5]${NC} Executando load testing..."
echo "----------------------------------------------"
node performance.test.js
LOAD_EXIT=$?
echo ""

# Resumo dos resultados
echo "=============================================="
echo "  📊 RESUMO DOS RESULTADOS"
echo "=============================================="
echo ""

if [ $SECURITY_EXIT -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Testes de Segurança: ${GREEN}PASSOU${NC}"
else
    echo -e "${RED}✗${NC} Testes de Segurança: ${RED}FALHOU${NC}"
fi

if [ $PERFORMANCE_EXIT -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Testes de Performance: ${GREEN}PASSOU${NC}"
else
    echo -e "${RED}✗${NC} Testes de Performance: ${RED}FALHOU${NC}"
fi

if [ $LOAD_EXIT -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Load Testing: ${GREEN}PASSOU${NC}"
else
    echo -e "${RED}✗${NC} Load Testing: ${RED}FALHOU${NC}"
fi

echo ""
echo "----------------------------------------------"
echo "Relatórios gerados:"
echo "  - performance-report.json"
echo "  - coverage/ (se disponível)"
echo ""
echo "Documentação:"
echo "  - AUDIT_REPORT.md (relatório completo)"
echo "  - AUDIT_SUMMARY.md (resumo executivo)"
echo "  - TEST_GUIDE.md (guia de testes)"
echo "=============================================="
echo ""

# Exit code final
if [ $SECURITY_EXIT -eq 0 ] && [ $PERFORMANCE_EXIT -eq 0 ] && [ $LOAD_EXIT -eq 0 ]; then
    echo -e "${GREEN}✅ TODOS OS TESTES PASSARAM${NC}"
    exit 0
else
    echo -e "${RED}❌ ALGUNS TESTES FALHARAM${NC}"
    exit 1
fi
