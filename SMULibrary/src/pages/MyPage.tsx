import { useState } from 'react';
import Profile from '../assets/profile.jpeg';

const MyPage = () => {
  // 파일 이미지 업로드(초기값은 null)
  const [preview, setPreview] = useState<string | null>(null);

  // 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string); // 미리보기 설정
      // setValue('thumbnail', reader.result as string); // form 필드에 반영
    };
    reader.readAsDataURL(file); // base64 변환
  };

  // 로그아웃 넣어야 함

  return (
    <div>
      {/* 프로필 */}
      <div className="relative w-60 h-60 rounded-full overflow-hidden">
        {/* 기본 프로필 이미지 */}
        <img src={Profile} alt="기본 LP" className="w-full h-full object-cover" />

        {/* 업로드된 썸네일이 있을 경우 위에 덮어쓰기 */}
        {preview && (
          <img
            src={preview}
            alt="profilePreview"
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        )}

        {/* 파일 input과 연결된 label */}
        <label htmlFor="upload-thumbnail" className="absolute inset-0 cursor-pointer" />
      </div>

      {/* 숨겨진 input */}
      <input
        type="file"
        accept="image/*"
        id="upload-thumbnail"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default MyPage;
