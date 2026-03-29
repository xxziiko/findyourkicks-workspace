'use client';
import { CardLayout } from '@/shared/components/layouts';
import {
  commaizeNumberWithUnit,
  formatDateDefault,
} from '@findyourkicks/shared';
import { useState } from 'react';
import type { OrderByIdResponse } from '../api/getOrderById';
import { STATUS_MAP, canCancel, canReturn } from '../utils/orderActions';
import { CancelRequestModal } from './CancelRequestModal';
import styles from './OrderDetail.module.scss';
import OrderProduct from './OrderProduct';
import { ReturnRequestForm } from './ReturnRequestForm';

interface OrderDetailProps {
  order: OrderByIdResponse;
}

export function OrderDetail({ order }: OrderDetailProps) {
  const { payment, address, products } = order;

  return (
    <div className={styles.container}>
      <OrderInfo order={order} />
      <OrderProducts products={products} />
      <OrderPayment payment={payment} />
      <OrderAddress address={address} />
    </div>
  );
}

function OrderInfo({ order }: { order: OrderByIdResponse }) {
  const {
    orderId,
    orderDate,
    status,
    trackingNumber,
    cancellationInfo,
    returnInfo,
  } = order;
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReturnForm, setShowReturnForm] = useState(false);

  const isCancellable = canCancel(status);
  const isReturnable = status === 'delivered' && canReturn(orderDate);

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>주문 정보</h2>
      <div className={styles.infoBox}>
        <div className={styles.infoRow}>
          <span className={styles.label}>주문번호</span>
          <span className={styles.value}>{orderId}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>주문일시</span>
          <span className={styles.value}>{formatDateDefault(orderDate)}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>주문상태</span>
          <span className={styles.value}>{STATUS_MAP[status] || status}</span>
        </div>
        {trackingNumber && (
          <div className={styles.infoRow}>
            <span className={styles.label}>송장번호</span>
            <span className={styles.value}>{trackingNumber}</span>
          </div>
        )}
        {cancellationInfo && (
          <div className={styles.infoRow}>
            <span className={styles.label}>취소 사유</span>
            <span className={styles.value}>{cancellationInfo.reason}</span>
          </div>
        )}
        {returnInfo && (
          <>
            <div className={styles.infoRow}>
              <span className={styles.label}>
                {returnInfo.returnType === 'exchange' ? '교환' : '반품'} 사유
              </span>
              <span className={styles.value}>{returnInfo.reason}</span>
            </div>
            {returnInfo.details && (
              <div className={styles.infoRow}>
                <span className={styles.label}>상세 사유</span>
                <span className={styles.value}>{returnInfo.details}</span>
              </div>
            )}
          </>
        )}
        {(isCancellable || isReturnable) && (
          <div className={styles.infoRow}>
            <span className={styles.label} />
            <span className={styles.value}>
              {isCancellable && (
                <button
                  type="button"
                  className={styles.actionBtn}
                  onClick={() => setShowCancelModal(true)}
                >
                  주문 취소
                </button>
              )}
              {isReturnable && (
                <button
                  type="button"
                  className={styles.actionBtn}
                  onClick={() => setShowReturnForm(true)}
                >
                  반품/교환 신청
                </button>
              )}
            </span>
          </div>
        )}
      </div>

      {showCancelModal && (
        <CancelRequestModal
          orderId={orderId}
          onClose={() => setShowCancelModal(false)}
        />
      )}
      {showReturnForm && (
        <ReturnRequestForm
          orderId={orderId}
          onClose={() => setShowReturnForm(false)}
        />
      )}
    </section>
  );
}

function OrderProducts({
  products,
}: { products: OrderByIdResponse['products'] }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>주문 상품</h2>
      <div className={styles.productList}>
        {products.map((product) => (
          <OrderProduct key={product.id} product={product} type="order" />
        ))}
      </div>
    </section>
  );
}

function OrderPayment({ payment }: { payment: OrderByIdResponse['payment'] }) {
  const { paymentMethod, paymentEasypayProvider, orderName, amount } = payment;

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>결제 정보</h2>
      <div className={styles.infoBox}>
        <div className={styles.infoRow}>
          <span className={styles.label}>결제수단</span>
          <span className={styles.value}>
            {paymentMethod} ({paymentEasypayProvider})
          </span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>주문자명</span>
          <span className={styles.value}>{orderName}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>결제금액</span>
          <span className={styles.value}>
            {commaizeNumberWithUnit(amount, '원')}
          </span>
        </div>
      </div>
    </section>
  );
}

function OrderAddress({ address }: { address: OrderByIdResponse['address'] }) {
  const {
    receiverName,
    receiverPhone,
    address: addressInfo,
    message,
  } = address;

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>배송 정보</h2>
      <div className={styles.infoBox}>
        <div className={styles.infoRow}>
          <span className={styles.label}>받는분</span>
          <span className={styles.value}>{receiverName}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>연락처</span>
          <span className={styles.value}>{receiverPhone}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>주소</span>
          <span className={styles.value}>{addressInfo}</span>
        </div>
        {message && (
          <div className={styles.infoRow}>
            <span className={styles.label}>배송메모</span>
            <span className={styles.value}>{message}</span>
          </div>
        )}
      </div>
    </section>
  );
}
