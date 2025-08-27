import Link from "next/link";
import { Title, Body } from "@/components/ui/Typography";
import { commonMetadata } from "@/app/metadata/common";

export const metadata = {
  ...commonMetadata,
  title: "개인정보 취급방침 | aiharu.net",
  description:
    "아이하루의 개인정보 수집, 이용, 보관, 파기 등에 관한 정책을 안내합니다.",
  openGraph: {
    ...commonMetadata.openGraph,
          title: "개인정보 취급방침 | aiharu.net",
      description:
        "아이하루의 개인정보 수집, 이용, 보관, 파기 등에 관한 정책을 안내합니다.",
    url: "https://aiharu.net/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-white px-4 py-20">
      <Link
        href="/"
        className="self-start mb-4 text-gray-700 hover:underline flex items-center gap-1 text-sm"
      >
        ← 홈으로 돌아가기
      </Link>
      <main className="flex flex-col items-center gap-8 w-full max-w-4xl">
        <Title className="text-center mb-8">개인정보 취급방침</Title>

        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow w-full text-gray-800 prose prose-gray max-w-none">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              1. 개인정보의 처리 목적
            </h2>
            <Body>
              아이하루는 다음의 목적을 위하여 개인정보를 처리하고 있으며, 다음의
              목적 이외의 용도로는 이용하지 않습니다.
            </Body>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>회원 가입 및 관리</li>
              <li>서비스 제공 및 운영</li>
              <li>고객 상담 및 문의 응대</li>
              <li>서비스 개선 및 신규 서비스 개발</li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              2. 개인정보의 처리 및 보유 기간
            </h2>
            <Body>
              아이하루는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터
              개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서
              개인정보를 처리·보유합니다.
            </Body>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>
                회원 탈퇴 시까지 (단, 관련 법령에 따라 보존이 필요한 경우 해당
                기간까지)
              </li>
              <li>서비스 이용 중단 후 1년</li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              3. 개인정보의 제3자 제공
            </h2>
            <Body>
              아이하루는 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서
              명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정
              등 개인정보 보호법 제17조 및 제18조에 해당하는 경우에만 개인정보를
              제3자에게 제공합니다.
            </Body>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              4. 개인정보처리의 위탁
            </h2>
            <Body>
              아이하루는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보
              처리업무를 위탁하고 있습니다.
            </Body>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="font-semibold">위탁받는 자 (수탁자)</p>
              <p>위탁하는 업무의 내용</p>
              <p>위탁기간</p>
              <p className="text-sm text-gray-600 mt-2">
                현재 위탁 업무가 없습니다. 향후 위탁 업무가 발생할 경우 이
                페이지를 통해 공지하겠습니다.
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              5. 정보주체의 권리·의무 및 그 행사방법
            </h2>
            <Body>
              이용자는 개인정보주체로서 다음과 같은 권리를 행사할 수 있습니다.
            </Body>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>개인정보 열람요구</li>
              <li>오류 등이 있을 경우 정정 요구</li>
              <li>삭제요구</li>
              <li>처리정지 요구</li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              6. 처리하는 개인정보의 항목
            </h2>
            <Body>아이하루는 다음의 개인정보 항목을 처리하고 있습니다.</Body>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="font-semibold">필수항목</p>
              <ul className="list-disc pl-6 mt-2">
                <li>이메일 주소</li>
                <li>서비스 이용 기록</li>
              </ul>
              <p className="font-semibold mt-4">선택항목</p>
              <ul className="list-disc pl-6 mt-2">
                <li>프로필 정보</li>
                <li>설정 정보</li>
              </ul>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              7. 개인정보의 파기
            </h2>
            <Body>
              아이하루는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가
              불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
            </Body>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>
                전자적 파일 형태의 정보는 기술적 방법을 사용하여 복구 불가능하게
                삭제
              </li>
              <li>
                종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기
              </li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              8. 개인정보의 안전성 확보 조치
            </h2>
            <Body>
              아이하루는 개인정보보호법 제29조에 따라 다음과 같은 안전성 확보
              조치를 취하고 있습니다.
            </Body>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>개인정보의 암호화</li>
              <li>해킹 등에 대비한 기술적 대책</li>
              <li>개인정보에 대한 접근 제한</li>
              <li>개인정보의 정기적인 백업</li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              9. 개인정보 보호책임자
            </h2>
            <Body>
              아이하루는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보
              처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와
              같이 개인정보 보호책임자를 지정하고 있습니다.
            </Body>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p>
                <span className="font-semibold">개인정보 보호책임자</span>
              </p>
              <p>이메일: jaloveeye@gmail.com</p>
              <p className="text-sm text-gray-600 mt-2">
                정보주체께서는 아이하루의 서비스(또는 사업)을 이용하시면서
                발생한 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에
                관한 사항을 개인정보 보호책임자에게 문의하실 수 있습니다.
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              10. 개인정보 처리방침 변경
            </h2>
            <Body>
              이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른
              변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일
              전부터 공지사항을 통하여 고지할 것입니다.
            </Body>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              <strong>시행일자:</strong> 2025년 7월 1일
            </p>
            <p className="text-sm text-gray-600 mt-2">
              <strong>최종 수정일:</strong> 2025년 7월 22일
            </p>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-2">회원 탈퇴</h3>
              <p className="text-sm text-gray-600 mb-3">
                회원 탈퇴를 원하시는 경우 아래 링크를 통해 탈퇴 요청을 할 수
                있습니다.
              </p>
              <a
                href="/withdraw"
                className="inline-block px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition-colors"
              >
                회원 탈퇴 요청
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
