import { useEffect, useState } from 'react';

interface AddressData {
  zonecode: string;
  roadAddress: string;
  jibunAddress: string;
  extraAddress: string;
}

export default function useDeliveryForm() {
  const [address, setAddress] = useState<AddressData>({
    zonecode: '',
    roadAddress: '',
    jibunAddress: '',
    extraAddress: '',
  });

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
        jibunAddress: string;
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

        setAddress({
          zonecode: data.zonecode,
          roadAddress: roadAddr,
          jibunAddress: data.jibunAddress,
          extraAddress: extraRoadAddr,
        });
      },
    }).open();
  };

  return { address, handlePostcode };
}
