import { createUserAddress } from '@/lib/api';
import { userIdAtom } from '@/lib/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export type DeliveryFormData = z.infer<typeof schema>;

const schema = z.object({
  name: z.string().min(1, { message: '이름을 입력해주세요.' }).max(10),
  phone: z
    .string()
    .min(1, { message: '전화번호를 입력해주세요.' })
    .max(11, { message: '전화번호는 11자리를 초과할 수 없습니다.' })
    .regex(/^[0-9]+$/, { message: '숫자만 입력해주세요.' }),
  alias: z.string().min(1).max(10),
  zonecode: z.string().min(1),
  roadAddress: z.string().min(1),
  extraAddress: z.string().min(1),
});

export default function useDeliveryForm(onClose: () => void) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<DeliveryFormData>({ resolver: zodResolver(schema) });

  const userId = useAtomValue(userIdAtom);

  const queryClient = useQueryClient();
  const { mutate: mutateUserAddress } = useMutation({
    mutationFn: createUserAddress,
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ['userAddress'] });
      onClose();
    },
  });

  const onSubmit = (data: DeliveryFormData) => {
    const formattedData = {
      ...data,
      address: `[${data.zonecode}] ${data.roadAddress} ${data.extraAddress}`,
      userId,
    };

    mutateUserAddress(formattedData);
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handlePostcode = (e: React.MouseEvent) => {
    e.preventDefault();

    new window.daum.Postcode({
      oncomplete: (data: {
        zonecode: string;
        roadAddress: string;
        bname: string;
        buildingName: string;
        apartment: string;
        autoRoadAddress: string;
        autoJibunAddress: string;
      }) => {
        const roadAddr = data.roadAddress;
        let extraRoadAddr = '';

        if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
          extraRoadAddr += data.bname;
        }
        if (data.buildingName !== '' && data.apartment === 'Y') {
          extraRoadAddr +=
            extraRoadAddr !== '' ? `, ${data.buildingName}` : data.buildingName;
        }
        if (extraRoadAddr !== '') {
          extraRoadAddr = ` (${extraRoadAddr})`;
        }

        setValue('zonecode', data.zonecode);
        setValue('roadAddress', roadAddr);
        setValue('extraAddress', extraRoadAddr);
      },
    }).open();
  };

  return { handlePostcode, register, handleSubmit, onSubmit, errors };
}
