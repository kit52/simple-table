import { Button, DatePicker, Form, Input, Modal, Switch, notification } from 'antd';
import { Product } from '../../types';
import dayjs from 'dayjs';
import { useEffect } from 'react';

interface ProductModalProps {
  selectedProduct?: Product;
  modalVisible: boolean;
  changeModalVisible: (val: boolean) => void;
  sendFormData: (values: Product, id?: number) => void;
  isPending: boolean;
}

const ProductModal = ({
  selectedProduct,
  modalVisible,
  changeModalVisible,
  sendFormData,
  isPending,
}: ProductModalProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (selectedProduct) {
      const formattedDate = selectedProduct.orderDate ? dayjs(selectedProduct.orderDate) : null;
      form.setFieldsValue({
        name: selectedProduct.name || '',
        weight: selectedProduct.weight || '',
        orderDate: formattedDate,
        inStock: selectedProduct.inStock || false,
        customer: selectedProduct.customer || '',
        id: selectedProduct.id,
      });
    } else {
      form.resetFields();
    }
  }, [selectedProduct, form]);

  const closeModal = () => {
    changeModalVisible(false);
  };

  const onFinish = async (values: Product) => {
    try {
      const productId = selectedProduct?.id ?? 0;
      await sendFormData({ ...values, id: productId }, productId);
      notification.success({
        message: 'Успешно сохранено',
        description: `Товар "${values.name}" успешно сохранен.`,
      });
      closeModal();
    } catch (error) {
      notification.error({
        message: 'Ошибка сохранения',
        description: 'Произошла ошибка при сохранении товара. Пожалуйста, попробуйте снова.',
      });
    }
  };

  const modalTitle = selectedProduct ? 'Изменить товар' : 'Создать товар';

  return (
    <Modal title={modalTitle} open={modalVisible} onCancel={closeModal} footer={null}>
      <Form form={form} name="product-form" onFinish={onFinish}>
        <Form.Item
          name="name"
          label="Наименование товара"
          rules={[
            {
              required: true,
              message: 'Пожалуйста, введите наименование товара!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="weight"
          label="Вес товара"
          rules={[{ required: true, message: 'Пожалуйста, введите вес товара!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="orderDate"
          label="Дата заказа"
          rules={[{ required: true, message: 'Пожалуйста, выберите дату заказа!' }]}
        >
          <DatePicker />
        </Form.Item>

        <Form.Item name="inStock" label="Наличие на складе" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item name="customer" label="Заказчик">
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isPending}>
            Сохранить
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductModal;
