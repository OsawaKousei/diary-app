import Image from "next/image";
import { FiArrowLeft } from "react-icons/fi";
import { LinkButton } from "@/components/ui/link-button";

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Image
              src="/repot_logo.png"
              alt="日記アプリロゴ"
              width={40}
              height={40}
              className="mr-3"
            />
            <h1 className="text-2xl font-bold text-primary">日記アプリ</h1>
          </div>
          <LinkButton href="/" variant="secondary">
            <FiArrowLeft className="mr-2" />
            ホームに戻る
          </LinkButton>
        </div>
      </div>
    </header>
  );
}
