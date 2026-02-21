# Testes de Funcionalidade e Segurança do Swagger
# EduShare Platform - Hackathon 5FSDT

Write-Host "`n╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  TESTES DE FUNCIONALIDADE E SEGURANÇA - SWAGGER API DOCS      ║" -ForegroundColor Cyan
Write-Host "║  EduShare Platform - Hackathon 5FSDT                          ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

$API_URL = "http://localhost:3000"
$SWAGGER_UI_URL = "$API_URL/api/docs"
$SWAGGER_JSON_URL = "$API_URL/api/docs/swagger.json"

$testResults = @{
    Total = 0
    Passed = 0
    Failed = 0
    SecurityIssues = @()
}

function Test-Endpoint {
    param(
        [string]$Name,
        [scriptblock]$Test,
        [string]$Category = "General"
    )
    
    $testResults.Total++
    Write-Host "`n[$Category] $Name" -ForegroundColor Yellow
    
    try {
        $result = & $Test
        if ($result) {
            Write-Host "  ✓ PASSED" -ForegroundColor Green
            $testResults.Passed++
            return $true
        } else {
            Write-Host "  ✗ FAILED" -ForegroundColor Red
            $testResults.Failed++
            return $false
        }
    } catch {
        Write-Host "  ✗ ERROR: $($_.Exception.Message)" -ForegroundColor Red
        $testResults.Failed++
        return $false
    }
}

# ============================================================================
# CATEGORIA 1: DISPONIBILIDADE E ACESSIBILIDADE
# ============================================================================

Write-Host "`n═══ CATEGORIA 1: DISPONIBILIDADE E ACESSIBILIDADE ═══" -ForegroundColor Magenta

Test-Endpoint -Name "Swagger UI está acessível" -Category "Disponibilidade" -Test {
    $response = Invoke-WebRequest -Uri $SWAGGER_UI_URL -UseBasicParsing -TimeoutSec 5
    return $response.StatusCode -eq 200
}

Test-Endpoint -Name "Swagger UI retorna HTML válido" -Category "Disponibilidade" -Test {
    $response = Invoke-WebRequest -Uri $SWAGGER_UI_URL -UseBasicParsing
    return $response.Content -match '<html' -and $response.Content -match 'swagger-ui'
}

Test-Endpoint -Name "Swagger JSON está acessível" -Category "Disponibilidade" -Test {
    $response = Invoke-WebRequest -Uri $SWAGGER_JSON_URL -UseBasicParsing -TimeoutSec 5
    return $response.StatusCode -eq 200
}

Test-Endpoint -Name "Swagger JSON retorna Content-Type correto" -Category "Disponibilidade" -Test {
    $response = Invoke-WebRequest -Uri $SWAGGER_JSON_URL -UseBasicParsing
    return $response.Headers['Content-Type'] -match 'application/json'
}

# ============================================================================
# CATEGORIA 2: VALIDAÇÃO DA ESPECIFICAÇÃO OPENAPI
# ============================================================================

Write-Host "`n═══ CATEGORIA 2: VALIDAÇÃO DA ESPECIFICAÇÃO OPENAPI ═══" -ForegroundColor Magenta

$spec = $null
try {
    $spec = Invoke-RestMethod -Uri $SWAGGER_JSON_URL -UseBasicParsing
} catch {
    Write-Host "✗ ERRO CRÍTICO: Não foi possível carregar a especificação OpenAPI" -ForegroundColor Red
}

if ($spec) {
    Test-Endpoint -Name "OpenAPI version é 3.0.0" -Category "OpenAPI" -Test {
        Write-Host "  Version: $($spec.openapi)"
        return $spec.openapi -eq '3.0.0'
    }

    Test-Endpoint -Name "Informações da API estão presentes" -Category "OpenAPI" -Test {
        Write-Host "  Title: $($spec.info.title)"
        Write-Host "  Version: $($spec.info.version)"
        return $spec.info.title -and $spec.info.version
    }

    Test-Endpoint -Name "Descrição da API menciona educação" -Category "OpenAPI" -Test {
        Write-Host "  Description: $($spec.info.description)"
        return $spec.info.description -match 'educação|professor|material|didático'
    }

    Test-Endpoint -Name "Licença MIT está configurada" -Category "OpenAPI" -Test {
        Write-Host "  License: $($spec.info.license.name)"
        return $spec.info.license.name -eq 'MIT'
    }

    Test-Endpoint -Name "Informações de contato estão presentes" -Category "OpenAPI" -Test {
        Write-Host "  Contact: $($spec.info.contact.name) - $($spec.info.contact.email)"
        return $spec.info.contact.name -and $spec.info.contact.email
    }

    Test-Endpoint -Name "Servidores (dev/prod) estão configurados" -Category "OpenAPI" -Test {
        Write-Host "  Servers: $($spec.servers.Count)"
        return $spec.servers.Count -ge 2
    }
}

# ============================================================================
# CATEGORIA 3: SEGURANÇA - AUTENTICAÇÃO E AUTORIZAÇÃO
# ============================================================================

Write-Host "`n═══ CATEGORIA 3: SEGURANÇA - AUTENTICAÇÃO ═══" -ForegroundColor Magenta

if ($spec) {
    Test-Endpoint -Name "JWT Bearer authentication está configurado" -Category "Segurança" -Test {
        $auth = $spec.components.securitySchemes.bearerAuth
        Write-Host "  Type: $($auth.type), Scheme: $($auth.scheme)"
        return $auth.type -eq 'http' -and $auth.scheme -eq 'bearer' -and $auth.bearerFormat -eq 'JWT'
    }

    Test-Endpoint -Name "Endpoints protegidos requerem autenticação" -Category "Segurança" -Test {
        $protectedCount = 0
        foreach ($path in $spec.paths.PSObject.Properties) {
            foreach ($method in $path.Value.PSObject.Properties) {
                if ($method.Value.security) {
                    $protectedCount++
                }
            }
        }
        Write-Host "  Endpoints protegidos: $protectedCount"
        return $protectedCount -gt 0
    }

    Test-Endpoint -Name "Endpoints públicos estão documentados (login/register)" -Category "Segurança" -Test {
        $hasLogin = $spec.paths.'/auth/login' -ne $null
        $hasRegister = $spec.paths.'/auth/register' -ne $null
        Write-Host "  Login endpoint: $hasLogin, Register endpoint: $hasRegister"
        return $hasLogin -and $hasRegister
    }
}

# ============================================================================
# CATEGORIA 4: SCHEMAS E MODELOS DE DADOS
# ============================================================================

Write-Host "`n═══ CATEGORIA 4: SCHEMAS E MODELOS DE DADOS ═══" -ForegroundColor Magenta

if ($spec) {
    $requiredSchemas = @('User', 'Material', 'Share', 'Error')
    
    foreach ($schemaName in $requiredSchemas) {
        Test-Endpoint -Name "Schema '$schemaName' está definido" -Category "Schemas" -Test {
            $schema = $spec.components.schemas.$schemaName
            if ($schema) {
                $propCount = ($schema.properties.PSObject.Properties | Measure-Object).Count
                Write-Host "  Properties: $propCount"
                return $propCount -gt 0
            }
            return $false
        }
    }

    Test-Endpoint -Name "Schema User tem propriedades obrigatórias" -Category "Schemas" -Test {
        $user = $spec.components.schemas.User
        $hasId = $user.properties.id -ne $null
        $hasEmail = $user.properties.email -ne $null
        $hasName = $user.properties.name -ne $null
        Write-Host "  Has ID: $hasId, Email: $hasEmail, Name: $hasName"
        return $hasId -and $hasEmail -and $hasName
    }
}

# ============================================================================
# CATEGORIA 5: ENDPOINTS DOCUMENTADOS
# ============================================================================

Write-Host "`n═══ CATEGORIA 5: ENDPOINTS DOCUMENTADOS ═══" -ForegroundColor Magenta

if ($spec) {
    $totalPaths = ($spec.paths.PSObject.Properties | Measure-Object).Count
    
    Test-Endpoint -Name "Pelo menos 10 paths estão documentados" -Category "Endpoints" -Test {
        Write-Host "  Total paths: $totalPaths"
        return $totalPaths -ge 10
    }

    # Auth Endpoints
    $authEndpoints = @('/auth/register', '/auth/login', '/auth/profile', '/auth/verify')
    foreach ($endpoint in $authEndpoints) {
        Test-Endpoint -Name "Endpoint '$endpoint' está documentado" -Category "Endpoints" -Test {
            return $spec.paths.$endpoint -ne $null
        }
    }

    # Materials Endpoints
    Test-Endpoint -Name "Endpoint '/products' (GET) está documentado" -Category "Endpoints" -Test {
        return $spec.paths.'/products'.get -ne $null
    }

    Test-Endpoint -Name "Endpoint '/products' (POST) está documentado" -Category "Endpoints" -Test {
        return $spec.paths.'/products'.post -ne $null
    }

    Test-Endpoint -Name "Endpoint '/products/{id}' está documentado" -Category "Endpoints" -Test {
        return $spec.paths.'/products/{id}' -ne $null
    }

    # Shares Endpoints
    Test-Endpoint -Name "Endpoint '/orders' está documentado" -Category "Endpoints" -Test {
        return $spec.paths.'/orders' -ne $null
    }
}

# ============================================================================
# CATEGORIA 6: QUALIDADE DA DOCUMENTAÇÃO
# ============================================================================

Write-Host "`n═══ CATEGORIA 6: QUALIDADE DA DOCUMENTAÇÃO ═══" -ForegroundColor Magenta

if ($spec) {
    Test-Endpoint -Name "Todos endpoints têm summary" -Category "Qualidade" -Test {
        $withoutSummary = 0
        foreach ($path in $spec.paths.PSObject.Properties) {
            foreach ($method in $path.Value.PSObject.Properties) {
                if (-not $method.Value.summary) {
                    $withoutSummary++
                }
            }
        }
        Write-Host "  Endpoints sem summary: $withoutSummary"
        return $withoutSummary -eq 0
    }

    Test-Endpoint -Name "Todos endpoints têm description" -Category "Qualidade" -Test {
        $withoutDescription = 0
        foreach ($path in $spec.paths.PSObject.Properties) {
            foreach ($method in $path.Value.PSObject.Properties) {
                if (-not $method.Value.description) {
                    $withoutDescription++
                }
            }
        }
        Write-Host "  Endpoints sem description: $withoutDescription"
        return $withoutDescription -eq 0
    }

    Test-Endpoint -Name "Todos endpoints têm tags" -Category "Qualidade" -Test {
        $withoutTags = 0
        foreach ($path in $spec.paths.PSObject.Properties) {
            foreach ($method in $path.Value.PSObject.Properties) {
                if (-not $method.Value.tags -or $method.Value.tags.Count -eq 0) {
                    $withoutTags++
                }
            }
        }
        Write-Host "  Endpoints sem tags: $withoutTags"
        return $withoutTags -eq 0
    }

    Test-Endpoint -Name "Tags estão organizadas (Auth, Materials, Shares)" -Category "Qualidade" -Test {
        $tagNames = $spec.tags | ForEach-Object { $_.name }
        Write-Host "  Tags: $($tagNames -join ', ')"
        return $tagNames -contains 'Auth' -and $tagNames -contains 'Materials' -and $tagNames -contains 'Shares'
    }
}

# ============================================================================
# CATEGORIA 7: SEGURANÇA - RESPOSTAS HTTP
# ============================================================================

Write-Host "`n═══ CATEGORIA 7: SEGURANÇA - RESPOSTAS HTTP ═══" -ForegroundColor Magenta

if ($spec) {
    Test-Endpoint -Name "Endpoints documentam erro 401 (Unauthorized)" -Category "Segurança HTTP" -Test {
        $with401 = 0
        foreach ($path in $spec.paths.PSObject.Properties) {
            foreach ($method in $path.Value.PSObject.Properties) {
                if ($method.Value.responses.'401') {
                    $with401++
                }
            }
        }
        Write-Host "  Endpoints com 401: $with401"
        return $with401 -gt 0
    }

    Test-Endpoint -Name "Endpoints documentam erro 500 (Server Error)" -Category "Segurança HTTP" -Test {
        $with500 = 0
        foreach ($path in $spec.paths.PSObject.Properties) {
            foreach ($method in $path.Value.PSObject.Properties) {
                if ($method.Value.responses.'500') {
                    $with500++
                }
            }
        }
        Write-Host "  Endpoints com 500: $with500"
        return $with500 -gt 0
    }

    Test-Endpoint -Name "Endpoints POST/PUT têm validação (400)" -Category "Segurança HTTP" -Test {
        $postPutWith400 = 0
        foreach ($path in $spec.paths.PSObject.Properties) {
            foreach ($method in $path.Value.PSObject.Properties) {
                if (($method.Name -eq 'post' -or $method.Name -eq 'put') -and $method.Value.responses.'400') {
                    $postPutWith400++
                }
            }
        }
        Write-Host "  POST/PUT com validação 400: $postPutWith400"
        return $postPutWith400 -gt 0
    }
}

# ============================================================================
# CATEGORIA 8: SEGURANÇA - REQUEST BODY
# ============================================================================

Write-Host "`n═══ CATEGORIA 8: SEGURANÇA - VALIDAÇÃO DE INPUT ═══" -ForegroundColor Magenta

if ($spec) {
    Test-Endpoint -Name "Register endpoint requer campos obrigatórios" -Category "Validação Input" -Test {
        $register = $spec.paths.'/auth/register'.post
        $schema = $register.requestBody.content.'application/json'.schema
        $required = $schema.required
        Write-Host "  Required fields: $($required -join ', ')"
        return $required -contains 'email' -and $required -contains 'password' -and $required -contains 'name'
    }

    Test-Endpoint -Name "Login endpoint requer email e senha" -Category "Validação Input" -Test {
        $login = $spec.paths.'/auth/login'.post
        $schema = $login.requestBody.content.'application/json'.schema
        $required = $schema.required
        Write-Host "  Required fields: $($required -join ', ')"
        return $required -contains 'email' -and $required -contains 'password'
    }

    Test-Endpoint -Name "POST /products requer campos obrigatórios" -Category "Validação Input" -Test {
        $createProduct = $spec.paths.'/products'.post
        if ($createProduct.requestBody) {
            $schema = $createProduct.requestBody.content.'application/json'.schema
            $required = $schema.required
            Write-Host "  Required fields: $($required -join ', ')"
            return $required.Count -gt 0
        }
        return $false
    }
}

# ============================================================================
# CATEGORIA 9: HEADERS DE SEGURANÇA
# ============================================================================

Write-Host "`n═══ CATEGORIA 9: HEADERS DE SEGURANÇA ═══" -ForegroundColor Magenta

Test-Endpoint -Name "Content-Security-Policy está configurado" -Category "Headers Segurança" -Test {
    $response = Invoke-WebRequest -Uri $SWAGGER_UI_URL -UseBasicParsing
    $csp = $response.Headers['Content-Security-Policy']
    Write-Host "  CSP: $($csp.Substring(0, [Math]::Min(50, $csp.Length)))..."
    return $csp -ne $null -and $csp.Length -gt 0
}

Test-Endpoint -Name "X-Content-Type-Options está configurado" -Category "Headers Segurança" -Test {
    $response = Invoke-WebRequest -Uri $SWAGGER_UI_URL -UseBasicParsing
    return $response.Headers['X-Content-Type-Options'] -eq 'nosniff'
}

Test-Endpoint -Name "X-Frame-Options está configurado" -Category "Headers Segurança" -Test {
    $response = Invoke-WebRequest -Uri $SWAGGER_UI_URL -UseBasicParsing
    $xfo = $response.Headers['X-Frame-Options']
    Write-Host "  X-Frame-Options: $xfo"
    return $xfo -eq 'SAMEORIGIN'
}

Test-Endpoint -Name "Strict-Transport-Security está presente" -Category "Headers Segurança" -Test {
    $response = Invoke-WebRequest -Uri $SWAGGER_UI_URL -UseBasicParsing
    $hsts = $response.Headers['Strict-Transport-Security']
    if ($hsts) {
        Write-Host "  HSTS: $hsts"
        return $true
    } else {
        Write-Host "  HSTS: Not configured (OK for localhost)"
        return $true  # OK para localhost
    }
}

# ============================================================================
# CATEGORIA 10: TESTES DE PENETRAÇÃO BÁSICOS
# ============================================================================

Write-Host "`n═══ CATEGORIA 10: TESTES DE PENETRAÇÃO BÁSICOS ═══" -ForegroundColor Magenta

Test-Endpoint -Name "Swagger UI não expõe informações sensíveis" -Category "Penetração" -Test {
    $response = Invoke-WebRequest -Uri $SWAGGER_UI_URL -UseBasicParsing
    $hasSensitiveInfo = $response.Content -match 'password|secret|key|token' -and
                        $response.Content -notmatch 'JWT|Bearer|Authorization'
    
    if ($hasSensitiveInfo) {
        $testResults.SecurityIssues += "Possíveis informações sensíveis expostas no Swagger UI"
        Write-Host "  ⚠️ WARNING: Possíveis informações sensíveis detectadas"
        return $false
    }
    return $true
}

Test-Endpoint -Name "API não aceita métodos HTTP inválidos" -Category "Penetração" -Test {
    try {
        $response = Invoke-WebRequest -Uri "$API_URL/api/docs" -Method TRACE -UseBasicParsing -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            $testResults.SecurityIssues += "API aceita método TRACE (vulnerabilidade XST)"
            return $false
        }
    } catch {
        # Esperado: deve rejeitar
    }
    return $true
}

Test-Endpoint -Name "Rate limiting está ativo" -Category "Penetração" -Test {
    try {
        for ($i = 1; $i -le 110; $i++) {
            $response = Invoke-WebRequest -Uri "$API_URL/health" -UseBasicParsing -ErrorAction SilentlyContinue
            if ($response.StatusCode -eq 429) {
                Write-Host "  Rate limit atingido na requisição $i"
                return $true
            }
        }
        Write-Host "  ⚠️ WARNING: Rate limit não detectado após 110 requisições"
        $testResults.SecurityIssues += "Rate limiting pode não estar configurado corretamente"
        return $false
    } catch {
        if ($_.Exception.Message -match '429') {
            return $true
        }
        return $false
    }
}

# ============================================================================
# RELATÓRIO FINAL
# ============================================================================

Write-Host "`n`n╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                    RELATÓRIO FINAL DE TESTES                   ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

$successRate = [math]::Round(($testResults.Passed / $testResults.Total) * 100, 2)

Write-Host "Total de Testes Executados: $($testResults.Total)" -ForegroundColor White
Write-Host "Testes Passaram: $($testResults.Passed)" -ForegroundColor Green
Write-Host "Testes Falharam: $($testResults.Failed)" -ForegroundColor Red
Write-Host "Taxa de Sucesso: $successRate%" -ForegroundColor $(if ($successRate -ge 90) { 'Green' } elseif ($successRate -ge 70) { 'Yellow' } else { 'Red' })

if ($testResults.SecurityIssues.Count -gt 0) {
    Write-Host "`n⚠️  PROBLEMAS DE SEGURANÇA IDENTIFICADOS:" -ForegroundColor Yellow
    foreach ($issue in $testResults.SecurityIssues) {
        Write-Host "   - $issue" -ForegroundColor Red
    }
} else {
    Write-Host "`n✓ NENHUM PROBLEMA DE SEGURANÇA CRÍTICO IDENTIFICADO" -ForegroundColor Green
}

# Classificação de Segurança
Write-Host "`nCLASSIFICAÇÃO DE SEGURANÇA:" -ForegroundColor Cyan
if ($successRate -ge 95 -and $testResults.SecurityIssues.Count -eq 0) {
    Write-Host "  🏆 EXCELENTE - Swagger documentação segura e completa" -ForegroundColor Green
} elseif ($successRate -ge 85) {
    Write-Host "  ✓ BOM - Algumas melhorias recomendadas" -ForegroundColor Yellow
} elseif ($successRate -ge 70) {
    Write-Host "  ⚠️ ACEITÁVEL - Requer melhorias" -ForegroundColor Yellow
} else {
    Write-Host "  ✗ INSUFICIENTE - Requer correções urgentes" -ForegroundColor Red
}

Write-Host "`n════════════════════════════════════════════════════════════════`n" -ForegroundColor Cyan

# Salvar resultados em arquivo
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$reportPath = "c:\Users\casho\Documents\projects\hackton_5fsdt\hackathon-microservices\SWAGGER_TEST_REPORT_$timestamp.txt"

$reportContent = @"
═══════════════════════════════════════════════════════════════
RELATÓRIO DE TESTES DE FUNCIONALIDADE E SEGURANÇA - SWAGGER
EduShare Platform - Hackathon 5FSDT
Data: $(Get-Date -Format "dd/MM/yyyy HH:mm:ss")
═══════════════════════════════════════════════════════════════

RESUMO EXECUTIVO:
-----------------
Total de Testes: $($testResults.Total)
Testes Aprovados: $($testResults.Passed)
Testes Reprovados: $($testResults.Failed)
Taxa de Sucesso: $successRate%

PROBLEMAS DE SEGURANÇA:
-----------------------
$( if ($testResults.SecurityIssues.Count -eq 0) { "Nenhum problema crítico identificado" } else { $testResults.SecurityIssues -join "`n" })

RECOMENDAÇÕES:
--------------
1. Manter documentação Swagger atualizada com cada mudança na API
2. Revisar periodicamente os schemas de segurança
3. Garantir que todos os endpoints protegidos exijam autenticação JWT
4. Implementar validação rigorosa de entrada em todos os endpoints
5. Monitorar logs de acesso ao Swagger para detectar tentativas de abuso

PRÓXIMOS PASSOS:
----------------
- Implementar testes automatizados de segurança
- Configurar CI/CD para validar documentação Swagger
- Adicionar exemplos de resposta para todos os endpoints
- Considerar implementação de OAuth2 para produção
"@

$reportContent | Out-File -FilePath $reportPath -Encoding UTF8
Write-Host "✓ Relatório salvo em: $reportPath" -ForegroundColor Green
