'use client';
import {
  CheckoutView,
  createOrderSheetSummary,
  useOrderItemsMutation,
  useTossPayments,
} from '@/features/order';
import type { OrderSheetByIdResponse } from '@/features/order-sheet/types';
import type { PaymentsResponse } from '@/features/payment/types';
import {
  useAddressModal,
  useDefaultAddressQuery,
} from '@/features/user/address';
import { useCheckoutAgreement, useDeliveryMessage } from '@/shared/hooks';

export default function Checkout({
  orderSheet,
}: { orderSheet: OrderSheetByIdResponse }) {
  const { orderSheetItems, orderSheetId } = orderSheet;

  const { isAllCheckedAgreement } = useCheckoutAgreement();

  const { totalPrice, totalPriceWithDeliveryFee, orderName } =
    createOrderSheetSummary(orderSheetItems);

  const { deliveryMessage } = useDeliveryMessage();
  const { data: defaultAddress } = useDefaultAddressQuery();
  const {
    isModalOpen,
    modalView,
    addressModalTitle,
    toggleModal,
    switchToFormView,
    closeModal,
  } = useAddressModal(defaultAddress);

  const { requestTossPayments } = useTossPayments();
  const { mutate: mutateOrderItems, isPending: isMutatingOrderItems } =
    useOrderItemsMutation();

  const handlePayment = () => {
    const payload = {
      orderSheetId,
      userAddressId: defaultAddress.addressId,
      deliveryAddress: {
        message: deliveryMessage,
      },
      termsAgreed: isAllCheckedAgreement,
    };

    mutateOrderItems(payload, {
      onSuccess: (response: PaymentsResponse) => {
        requestTossPayments({
          ...response,
          orderName,
          amount: totalPriceWithDeliveryFee,
        });
      },
    });
  };

  const props = {
    address: {
      defaultAddress,
      modalTitle: addressModalTitle,
      modalView,
      isModalOpen,
      onModalToggle: toggleModal,
      onSwitchToFormView: switchToFormView,
      onCloseModal: closeModal,
    },
    price: {
      totalPrice,
      totalPriceWithDeliveryFee,
    },
    agreement: {
      isAllChecked: isAllCheckedAgreement,
    },
    order: {
      items: orderSheetItems,
      isMutating: isMutatingOrderItems,
      onPayment: handlePayment,
    },
  };

  return <CheckoutView {...props} />;
}
