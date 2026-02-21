class OrderController {
  constructor(createOrderUseCase, orderRepository) {
    this.createOrderUseCase = createOrderUseCase;
    this.orderRepository = orderRepository;
  }

  async createOrder(req, res) {
    try {
      const order = await this.createOrderUseCase.execute(req.user.id, req.body);

      res.status(201).json({
        success: true,
        data: order,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getMyOrders(req, res) {
    try {
      const orders = await this.orderRepository.findOrdersByUserId(req.user.id);

      res.status(200).json({
        success: true,
        data: orders,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getOrderById(req, res) {
    try {
      const order = await this.orderRepository.findOrderById(req.params.id);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Share not found',
        });
      }

      // Check if user owns the share
      if (order.userId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied',
        });
      }

      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateOrderStatus(req, res) {
    try {
      const { status } = req.body;
      const order = await this.orderRepository.findOrderById(req.params.id);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Share not found',
        });
      }

      if (!order.canTransitionTo(status)) {
        return res.status(400).json({
          success: false,
          message: `Cannot transition from ${order.status} to ${status}`,
        });
      }

      const updatedOrder = await this.orderRepository.updateOrderStatus(req.params.id, status);

      res.status(200).json({
        success: true,
        data: updatedOrder,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = OrderController;
