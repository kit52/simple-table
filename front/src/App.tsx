import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, message, Dropdown } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import { Product } from './types';
import ProductModal from './components/ProductModal/ProductModal';
import { createProduct, deleteProduct, fetchDataProducts, updateProduct } from './api/api';

const { Column } = Table;

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [messageApi] = message.useMessage();

  const showError = useCallback(() => {
    messageApi.open({
      type: 'error',
      content: 'Ошибка при получении данных',
    });
  }, [messageApi]);

  const fetchData = useCallback(async () => {
    setIsPending(true);
    try {
      const response = await fetchDataProducts();
      setProducts(response.data);
    } catch (error) {
      showError();
    } finally {
      setIsPending(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const changeModalVisible = useCallback((val: boolean) => {
    setModalVisible(val);
    setSelectedProduct(undefined);
  }, []);

  const handleEdit = useCallback((product: Product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  }, []);

  const handleDelete = useCallback(
    async (product: Product) => {
      setIsPending(true);
      try {
        await deleteProduct(product.id);
        fetchData();
      } catch (error) {
        showError();
      } finally {
        setIsPending(false);
      }
    },
    [fetchData, showError]
  );

  const onFinish = useCallback(
    async (product: Product, id?: number) => {
      setIsPending(true);
      try {
        if (id) {
          await updateProduct(product);
        } else {
          await createProduct(product);
        }
        fetchData();
      } catch (error) {
        showError();
      } finally {
        setModalVisible(false);
        setIsPending(false);
        setSelectedProduct(undefined);
      }
    },
    [fetchData, showError]
  );

  const getMenuProps = useCallback(
    (record: Product) => ({
      items: [
        {
          label: 'Изменить',
          key: 'edit',
          onClick: () => handleEdit(record),
        },
        {
          label: 'Удалить',
          key: 'delete',
          onClick: () => handleDelete(record),
        },
      ],
    }),
    [handleEdit, handleDelete]
  );

  return (
    <div className="app">
      <h1>Таблица</h1>
      <div className="table-wrapper">
        <Table className="table" dataSource={products} rowKey="id" loading={isPending}>
          <Column title="ID товара" dataIndex="id" key="id" sorter={(a: Product, b: Product) => a.id - b.id} />
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
            sorter={(a: Product, b: Product) => new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime()}
            render={(date: string) => (date ? dayjs(date).format('DD-MM-YYYY') : '')}
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
      <ProductModal
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
