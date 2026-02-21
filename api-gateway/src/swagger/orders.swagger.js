/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Listar compartilhamentos
 *     description: Retorna lista de compartilhamentos de materiais realizados pelo professor
 *     tags: [Shares]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Quantidade de itens por página
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, completed, cancelled]
 *         description: Filtrar por status do compartilhamento
 *     responses:
 *       200:
 *         description: Lista de compartilhamentos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Share'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     total:
 *                       type: integer
 *                       example: 50
 *       401:
 *         description: Token inválido ou ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Criar compartilhamento
 *     description: Permite que um professor compartilhe um material com outro professor
 *     tags: [Shares]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - material_id
 *             properties:
 *               material_id:
 *                 type: string
 *                 example: 123e4567-e89b-12d3-a456-426614174000
 *                 description: ID do material a ser compartilhado
 *               recipient_email:
 *                 type: string
 *                 format: email
 *                 example: joao.santos@educacao.sp.gov.br
 *                 description: E-mail do professor que receberá o material
 *               message:
 *                 type: string
 *                 example: Este material pode ser útil para suas aulas de matemática!
 *                 description: Mensagem opcional para o destinatário
 *               notify:
 *                 type: boolean
 *                 example: true
 *                 description: Se deve notificar o destinatário por e-mail
 *     responses:
 *       201:
 *         description: Compartilhamento criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Material compartilhado com sucesso
 *                 data:
 *                   $ref: '#/components/schemas/Share'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token inválido ou ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Material ou destinatário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Obter compartilhamento específico
 *     description: Retorna detalhes de um compartilhamento específico
 *     tags: [Shares]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do compartilhamento
 *     responses:
 *       200:
 *         description: Compartilhamento retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Share'
 *       401:
 *         description: Token inválido ou ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Compartilhamento não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   patch:
 *     summary: Atualizar status do compartilhamento
 *     description: Permite atualizar o status de um compartilhamento (ex. marcar como concluído)
 *     tags: [Shares]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do compartilhamento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, completed, cancelled]
 *                 example: completed
 *                 description: Novo status do compartilhamento
 *               notes:
 *                 type: string
 *                 example: Material recebido e adaptado para minhas turmas
 *                 description: Notas adicionais sobre o compartilhamento
 *     responses:
 *       200:
 *         description: Compartilhamento atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Compartilhamento atualizado com sucesso
 *                 data:
 *                   $ref: '#/components/schemas/Share'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token inválido ou ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Compartilhamento não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Cancelar compartilhamento
 *     description: Permite cancelar/deletar um compartilhamento
 *     tags: [Shares]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do compartilhamento
 *     responses:
 *       200:
 *         description: Compartilhamento cancelado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Compartilhamento cancelado com sucesso
 *       401:
 *         description: Token inválido ou ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Compartilhamento não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /orders/statistics:
 *   get:
 *     summary: Estatísticas de compartilhamento
 *     description: Retorna estatísticas sobre compartilhamentos realizados e recebidos
 *     tags: [Shares]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     total_shared:
 *                       type: integer
 *                       example: 45
 *                       description: Total de materiais compartilhados
 *                     total_received:
 *                       type: integer
 *                       example: 32
 *                       description: Total de materiais recebidos
 *                     most_shared_material:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         title:
 *                           type: string
 *                         shares_count:
 *                           type: integer
 *                     collaboration_network:
 *                       type: object
 *                       properties:
 *                         unique_teachers:
 *                           type: integer
 *                           example: 15
 *                           description: Número de professores com quem colaborou
 *       401:
 *         description: Token inválido ou ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

module.exports = {};
