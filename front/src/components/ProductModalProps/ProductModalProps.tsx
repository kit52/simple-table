import { Button, DatePicker, Form, Input, Modal, Switch } from 'antd';
import { Product } from '../../types';
import dayjs from 'dayjs';
export interface ProductModalProps {
  selectedProduct?: Product | null;
  modalVisible: boolean;
  changeModalVisible: (val: boolean) => void;
  sendFormData: (values: Product, id?: number) => void;
  isPending: boolean;
}
const ProductModal = (props: ProductModalProps) => {
  const {
    selectedProduct,
    modalVisible,
    changeModalVisible,
    sendFormData,
    isPending,
  } = props;
  const [form] = Form.useForm();
  const inputDate = selectedProduct?.orderDate;
  const formattedDate = inputDate ? dayjs(inputDate) : null;

  form.setFieldsValue({
    name: selectedProduct?.name || '',
    weight: selectedProduct?.weight || '',
    orderDate: formattedDate,
    inStock: selectedProduct?.inStock || '',
    customer: selectedProduct?.customer || '',
    id: selectedProduct?.id,
  });
  const closeModal = () => {
    changeModalVisible(false);
  };
  const onFinish = (values: any) => {
    sendFormData(
      { ...values, id: selectedProduct?.id || '' },
      selectedProduct?.id
    );
  };

  return (
    <Modal
      title={selectedProduct ? 'Изменить товар' : 'Создать товар'}
      open={modalVisible}
      onCancel={closeModal}
      footer={null}
    >
      <Form
        form={form}
        name="product-form"
        onFinish={onFinish}
        initialValues={selectedProduct || undefined}
      >
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
          rules={[
            { required: true, message: 'Пожалуйста, введите вес товара!' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="orderDate"
          label="Дата заказа"
          rules={[
            { required: true, message: 'Пожалуйста, выберите дату заказа!' },
          ]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          name="inStock"
          label="Наличие на складе"
          valuePropName="checked"
        >
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
