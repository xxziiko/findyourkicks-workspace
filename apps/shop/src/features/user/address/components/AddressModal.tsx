import { AddressForm, AddressList } from '@/features/user/address';
import { Button, Modal } from '@findyourkicks/shared';

interface AddressModalProps {
  addressModalTitle: string;
  modalView: 'form' | 'list';
  isOpen: boolean;
  onClick: () => void;
  onClose: () => void;
}

export function AddressModal({
  addressModalTitle,
  modalView,
  isOpen,
  onClick,
  onClose,
}: AddressModalProps) {
  return (
    <Modal title={addressModalTitle} isOpen={isOpen}>
      {modalView === 'list' ? (
        <div>
          <Button onClick={onClick} variant="secondary" width="100%">
            배송지 추가하기
          </Button>

          <AddressList onClose={onClose} />
        </div>
      ) : (
        <AddressForm onClose={onClose} />
      )}
    </Modal>
  );
}
