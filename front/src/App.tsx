import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Switch,
  message,
  Dropdown,
  Menu,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Product } from './types';
import ProductModalProps from './components/ProductModalProps/ProductModalProps';
import {
  createProduct,
  deleteProduct,
  fetchDataProducts,
  updateProduct,
} from './api/api';
import type { MenuProps } from 'antd';
import dayjs from 'dayjs';

const { Column } = Table;

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isPending, SetIsPending] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const errorHandler = () => {
    messageApi.open({
      type: 'error',
      content: 'Ошибка при получении данных',
    });
  };
  useEffect(() => {
    fetchData();
  }, []);
  const changeModalVisible = useCallback((val: boolean) => {
    setModalVisible(val);
    setSelectedProduct(null);
  }, []);

  const fetchData = async () => {
    SetIsPending(true);
    try {
      const response = await fetchDataProducts();
      setProducts(response.data);
    } catch (error) {
      errorHandler();
    } finally {
      SetIsPending(false);
    }
  };

  const handleEdit = useCallback((product: Product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  }, []);

  const handleDelete = async (product: Product) => {
    SetIsPending(true);
    try {
      const response = await deleteProduct(product.id);
      const products = await fetchDataProducts();
      setProducts(products.data);
    } catch (error) {
      errorHandler();
    } finally {
      SetIsPending(false);
    }
  };

  const onFinish = async (product: Product, id?: number) => {
    SetIsPending(true);

    try {
      const response = id
        ? await updateProduct(product)
        : await createProduct(product);

      const products = await fetchDataProducts();
      setProducts(products.data);
    } catch (error) {
      errorHandler();
    } finally {
      setModalVisible(false);
      SetIsPending(false);
      setSelectedProduct(null);
    }
  };

  const getMenuProps = (record: Product) => {
    return {
      items: [
        {
          label: 'Изменить',
          key: '1',
          onClick: () => handleEdit(record),
        },
        {
          label: 'Удалить',
          key: '2',
          onClick: () => handleDelete(record),
        },
      ],
    };
  };
  return (
    <div className="app">
      <h1>Таблица</h1>
      <div className="table-wrapper">
        <Table className="table" dataSource={products} rowKey="id">
          <Column
            title="ID товара"
            dataIndex="id"
            key="id"
            sorter={(a: Product, b: Product) => a.id - b.id}
          />
          <Column
            title="Наименование товара"
            dataIndex="name"
            key="name"
            sorter={(a: Product, b: Product) => a.name.localeCompare(b.name)}
          />
          <Column title="Вес товара" dataIndex="weight" key="weight" />
          <Column
            title="Дата заказа"
            dataIndex="orderDate"
            key="orderDate"
            sorter={(a: Product, b: Product) =>
              new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime()
            }
            render={(date: string) =>
              date ? `${dayjs(date).format('DD-MM-YYYY')}` : ''
            }
          />

          <Column
            title="Наличие на складе"
            dataIndex="inStock"
            key="inStock"
            render={(inStock) => (inStock ? 'Да' : 'Нет')}
          />
          <Column title="Заказчик" dataIndex="customer" key="customer" />
          <Column
            title="Действия"
            key="actions"
            render={(record: Product) => (
              <Dropdown menu={getMenuProps(record)}>
                <Button>
                  <SettingOutlined />
                </Button>
              </Dropdown>
            )}
          />
        </Table>
      </div>
      <ProductModalProps
        modalVisible={modalVisible}
        changeModalVisible={changeModalVisible}
        sendFormData={onFinish}
        selectedProduct={selectedProduct}
        isPending={isPending}
      />
      <Button onClick={() => setModalVisible(true)}>Создать товар</Button>
    </div>
  );
};

export default App;
