-- ============================================================
-- EduShare - Seed de Materiais Didáticos Realistas
-- Conteúdos alinhados à BNCC para professores da rede pública
-- ============================================================

-- Limpar tabela existente
DELETE FROM products;
ALTER SEQUENCE products_id_seq RESTART WITH 1;

-- ============================================================
-- MATEMÁTICA (3 materiais)
-- ============================================================

INSERT INTO products (name, description, price, stock, category, image_url) VALUES
(
  'Frações no Cotidiano — Sequência Didática (5º ano)',
  'Sequência didática com 8 aulas alinhada à BNCC (EF05MA03). Utiliza situações reais como dividir pizzas, medir ingredientes de receitas culinárias e calcular descontos em compras para introduzir frações equivalentes e operações com frações. Inclui atividades impressas, jogos manipulativos com material dourado e avaliação formativa com rubrica. Testado em turmas de 28 alunos na EMEF Maria Quitéria, São Paulo/SP.',
  0, 347, 'Matemática',
  'https://placehold.co/300x200/2980b9/ffffff?text=Fracoes+no+Cotidiano'
),
(
  'Geometria Espacial — Sólidos com Canudos e Jujubas',
  'Plano de aula prático para construção de sólidos geométricos (cubo, tetraedro, octaedro, prismas) usando canudos e jujubas como vértices. Os alunos registram faces, arestas e vértices, verificando a Relação de Euler na prática. Alinhado à BNCC (EF06MA17). Inclui ficha de registro do aluno, roteiro do professor e fotos orientativas. Material de baixo custo ideal para escolas com recursos limitados.',
  0, 512, 'Matemática',
  'https://placehold.co/300x200/2980b9/ffffff?text=Geometria+Espacial'
),
(
  'Estatística para o 9º ano — Pesquisa sobre Transporte Escolar',
  'Projeto interdisciplinar onde os alunos coletam dados reais sobre como os colegas chegam à escola (ônibus, a pé, bicicleta, carro). Trabalha construção de tabelas de frequência, gráficos de setores e barras, média, mediana e moda. Alinhado à BNCC (EF09MA22). Duração: 6 aulas. Inclui questionário modelo, planilha de tabulação e apresentação final em grupo.',
  0, 189, 'Matemática',
  'https://placehold.co/300x200/2980b9/ffffff?text=Estatistica+9ano'
);

-- ============================================================
-- PORTUGUÊS (3 materiais)
-- ============================================================

INSERT INTO products (name, description, price, stock, category, image_url) VALUES
(
  'Crônicas de Rubem Braga — Oficina de Leitura e Escrita',
  'Oficina com 5 crônicas selecionadas de Rubem Braga ("Ai de ti, Copacabana!", "O Pavão", "Recado de Primavera") para turmas do 8º e 9º ano. Cada crônica acompanha roteiro de leitura com estratégias de antecipação, inferência e conexão. Na produção textual, os alunos escrevem suas próprias crônicas sobre o bairro onde moram. Alinhado à BNCC (EF89LP33). Inclui rúbrica de avaliação da produção.',
  0, 623, 'Português',
  'https://placehold.co/300x200/27ae60/ffffff?text=Cronicas+Rubem+Braga'
),
(
  'Cordel na Sala de Aula — Da Leitura à Xilogravura',
  'Projeto integrado Português + Artes que apresenta a literatura de cordel nordestina. Os alunos leem cordéis de Patativa do Assaré e Bráulio Bessa, analisam rimas e métrica, produzem seus próprios versos e ilustram com xilogravura em bandejas de isopor. Alinhado à BNCC (EF67LP28). Duração: 10 aulas. Inclui coletânea de cordéis, tutorial de xilogravura e modelo de varal literário.',
  0, 438, 'Português',
  'https://placehold.co/300x200/27ae60/ffffff?text=Cordel+Sala+de+Aula'
),
(
  'Interpretação de Texto — Notícias e Fake News (7º ano)',
  'Sequência de 6 aulas que desenvolve leitura crítica de notícias. Os alunos comparam veículos de imprensa, identificam fatos vs. opiniões, analisam manchetes sensacionalistas e aprendem a verificar fontes. Culmina com a produção de um "jornal da escola" com notícias verificadas. Alinhado à BNCC (EF67LP01, EF67LP02). Inclui banco de notícias recortadas, checklist de verificação e modelo do jornal.',
  0, 891, 'Português',
  'https://placehold.co/300x200/27ae60/ffffff?text=Fake+News+7ano'
);

-- ============================================================
-- CIÊNCIAS (2 materiais)
-- ============================================================

INSERT INTO products (name, description, price, stock, category, image_url) VALUES
(
  'Sistema Solar em Escala — Maquete no Pátio da Escola',
  'Roteiro completo para construir uma maquete do Sistema Solar em escala de distância no pátio da escola. O Sol fica na quadra e Netuno pode ficar a até 450 metros! Os alunos calculam as proporções, medem distâncias e registram no caderno. Alinhado à BNCC (EF06CI13). Inclui tabela de escalas, ficha de campo, questionário pós-atividade e relato de experiência da aplicação na EM Prof. João Kopke, Campinas/SP.',
  0, 276, 'Ciências',
  'https://placehold.co/300x200/e74c3c/ffffff?text=Sistema+Solar+Escala'
),
(
  'Horta Escolar — Fotossíntese e Ciclo da Água na Prática',
  'Projeto bimestral que integra Ciências e Educação Ambiental. Os alunos montam uma horta em garrafas PET, observam germinação, fotossíntese e transpiração vegetal, e registram o desenvolvimento com fotos semanais em diário de bordo. Alinhado à BNCC (EF07CI06). Inclui lista de materiais de baixo custo, cronograma de 8 semanas, fichas de observação e sugestão de feira de ciências com os resultados.',
  0, 715, 'Ciências',
  'https://placehold.co/300x200/e74c3c/ffffff?text=Horta+Escolar'
);

-- ============================================================
-- HISTÓRIA (2 materiais)
-- ============================================================

INSERT INTO products (name, description, price, stock, category, image_url) VALUES
(
  'Brasil Colônia através de Mapas Históricos',
  'Atividade investigativa onde os alunos analisam 8 mapas do período colonial (1500-1822): Mapa de Cantino, capitanias hereditárias, rotas do tráfico negreiro e ciclo do ouro. Para cada mapa, há questões que desenvolvem leitura cartográfica e pensamento histórico. Alinhado à BNCC (EF07HI09, EF07HI11). Inclui mapas em alta resolução para impressão A3, roteiro de análise e atividade comparativa com mapa atual.',
  0, 324, 'História',
  'https://placehold.co/300x200/f39c12/ffffff?text=Brasil+Colonia+Mapas'
),
(
  'Linha do Tempo Colaborativa — Ditadura Militar no Brasil',
  'Dinâmica colaborativa onde grupos de alunos pesquisam eventos-chave de 1964 a 1985 (AI-5, Milagre Econômico, Diretas Já, Anistia) e montam uma linha do tempo em papel kraft de 5 metros. Cada evento inclui data, descrição, fonte primária e impacto social. Alinhado à BNCC (EF09HI19, EF09HI20). Inclui banco de fontes primárias (fotos, manchetes, trechos de discurso), modelo da linha do tempo e rubrica.',
  0, 456, 'História',
  'https://placehold.co/300x200/f39c12/ffffff?text=Ditadura+Linha+Tempo'
);

-- ============================================================
-- GEOGRAFIA (2 materiais)
-- ============================================================

INSERT INTO products (name, description, price, stock, category, image_url) VALUES
(
  'Biomas Brasileiros — Jogo de Tabuleiro Educativo',
  'Jogo de tabuleiro para 4-6 jogadores onde os alunos percorrem os 6 biomas brasileiros respondendo perguntas sobre fauna, flora, clima e impactos ambientais. Inclui 120 cartas-pergunta com 3 níveis de dificuldade, tabuleiro para impressão colorida em A2, peões recortáveis e manual de regras. Alinhado à BNCC (EF07GE11). Testado com turmas de 6º e 7º ano. Tempo médio de jogo: 40 minutos.',
  0, 934, 'Geografia',
  'https://placehold.co/300x200/8e44ad/ffffff?text=Biomas+Jogo+Tabuleiro'
),
(
  'Urbanização Brasileira — Análise de Imagens de Satélite',
  'Atividade prática usando Google Earth gratuito para comparar imagens de satélite de cidades brasileiras em diferentes décadas. Os alunos analisam o crescimento urbano de São Paulo, Manaus e Brasília, identificam problemas como desmatamento e ocupação irregular, e elaboram relatório com propostas de planejamento. Alinhado à BNCC (EF08GE16). Inclui tutorial ilustrado do Google Earth e roteiro de investigação.',
  0, 267, 'Geografia',
  'https://placehold.co/300x200/8e44ad/ffffff?text=Urbanizacao+Satelite'
);

-- ============================================================
-- INGLÊS (2 materiais)
-- ============================================================

INSERT INTO products (name, description, price, stock, category, image_url) VALUES
(
  'English with Music — Listening Comprehension (8º/9º ano)',
  'Sequência de 6 aulas usando músicas populares internacionais (Imagine - John Lennon, What a Wonderful World - Louis Armstrong, Count on Me - Bruno Mars) para desenvolver compreensão auditiva e vocabulário. Cada aula traz a letra com lacunas (gap-fill), exercícios de pronúncia, discussão temática e produção de parágrafo em inglês. Alinhado à BNCC (EF08LI03). Inclui áudios sugeridos, fichas do aluno e gabarito.',
  0, 578, 'Inglês',
  'https://placehold.co/300x200/1abc9c/ffffff?text=English+with+Music'
),
(
  'Classroom Commands & Routines — Pôsteres para Sala de Aula',
  'Kit com 15 pôsteres coloridos A4 para impressão com expressões e comandos em inglês usados no dia a dia da sala de aula (Open your books, Raise your hand, May I go to the restroom?). Cada pôster traz a expressão, tradução, pronúncia simplificada e ilustração. Ideal para imersão linguística desde o 6º ano. Alinhado à BNCC (EF06LI01). Inclui versões em cores e em preto e branco para economia de impressão.',
  0, 1203, 'Inglês',
  'https://placehold.co/300x200/1abc9c/ffffff?text=Classroom+Commands'
);

-- ============================================================
-- EDUCAÇÃO FÍSICA (1 material)
-- ============================================================

INSERT INTO products (name, description, price, stock, category, image_url) VALUES
(
  'Jogos Cooperativos — 20 Atividades sem Material',
  'Coletânea de 20 jogos cooperativos que não exigem nenhum material específico, perfeitos para escolas com poucos recursos. Cada jogo inclui objetivos, regras, variações e reflexão sobre valores como cooperação, respeito e inclusão. Atividades como "Nó Humano", "Espelho", "Travessia do Rio" e "Salve-se com um Abraço". Alinhado à BNCC (EF67EF01). Faixa etária: 6º ao 9º ano. Testado em escolas públicas de Recife/PE.',
  0, 845, 'Educação Física',
  'https://placehold.co/300x200/e67e22/ffffff?text=Jogos+Cooperativos'
);

-- ============================================================
-- ARTES (1 material)
-- ============================================================

INSERT INTO products (name, description, price, stock, category, image_url) VALUES
(
  'Releitura de Tarsila do Amaral — Abaporu e Paisagens',
  'Projeto artístico de 4 aulas onde os alunos conhecem a vida e obra de Tarsila do Amaral, analisam elementos visuais de "Abaporu", "A Negra" e "Paisagem com Touro", e criam releituras usando técnicas mistas (colagem, guache, giz de cera). Inclui biografia acessível, imagens das obras para projeção, roteiro de análise visual e critérios de avaliação. Alinhado à BNCC (EF69AR02). Adaptável do 6º ao 9º ano.',
  0, 392, 'Artes',
  'https://placehold.co/300x200/9b59b6/ffffff?text=Tarsila+Releitura'
);

-- ============================================================
-- FILOSOFIA (1 material)
-- ============================================================

INSERT INTO products (name, description, price, stock, category, image_url) VALUES
(
  'Filosofia para Jovens — Debates sobre Ética e Cidadania',
  'Caderno com 8 dilemas éticos adaptados para adolescentes: "É correto colar na prova se todos colam?", "Devemos denunciar um amigo que cometeu bullying?", "Até onde vai a liberdade de expressão na internet?". Para cada dilema, há textos motivadores, perguntas socráticas e estrutura para debate em sala. Alinhado à BNCC (EM13CHS601). Inclui regras para debate respeitoso e ficha de autoavaliação. Usado com sucesso no CIEP Brizolão, Rio de Janeiro/RJ.',
  0, 531, 'Filosofia',
  'https://placehold.co/300x200/34495e/ffffff?text=Filosofia+Debates'
);
