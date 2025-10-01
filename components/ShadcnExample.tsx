"use client";

import {
  ShadcnButton,
  ShadcnCard,
  ShadcnCardHeader,
  ShadcnCardTitle,
  ShadcnCardDescription,
  ShadcnCardContent,
  ShadcnInput,
  Label,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Badge,
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui";

export default function ShadcnExample() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">shadcn/ui 컴포넌트 예시</h1>

      {/* Button 예시 */}
      <ShadcnCard>
        <ShadcnCardHeader>
          <ShadcnCardTitle>Button 컴포넌트</ShadcnCardTitle>
          <ShadcnCardDescription>다양한 버튼 스타일 예시</ShadcnCardDescription>
        </ShadcnCardHeader>
        <ShadcnCardContent className="space-x-4">
          <ShadcnButton>기본 버튼</ShadcnButton>
          <ShadcnButton variant="secondary">보조 버튼</ShadcnButton>
          <ShadcnButton variant="outline">아웃라인 버튼</ShadcnButton>
          <ShadcnButton variant="ghost">고스트 버튼</ShadcnButton>
          <ShadcnButton variant="destructive">위험 버튼</ShadcnButton>
        </ShadcnCardContent>
      </ShadcnCard>

      {/* Input 예시 */}
      <ShadcnCard>
        <ShadcnCardHeader>
          <ShadcnCardTitle>Input 컴포넌트</ShadcnCardTitle>
          <ShadcnCardDescription>폼 입력 요소 예시</ShadcnCardDescription>
        </ShadcnCardHeader>
        <ShadcnCardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <ShadcnInput
              id="email"
              type="email"
              placeholder="이메일을 입력하세요"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">메시지</Label>
            <Textarea id="message" placeholder="메시지를 입력하세요" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">카테고리</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="카테고리를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ai">AI</SelectItem>
                <SelectItem value="tech">기술</SelectItem>
                <SelectItem value="parenting">육아</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </ShadcnCardContent>
      </ShadcnCard>

      {/* Badge 예시 */}
      <ShadcnCard>
        <ShadcnCardHeader>
          <ShadcnCardTitle>Badge 컴포넌트</ShadcnCardTitle>
          <ShadcnCardDescription>상태 표시 뱃지 예시</ShadcnCardDescription>
        </ShadcnCardHeader>
        <ShadcnCardContent className="space-x-2">
          <Badge>기본</Badge>
          <Badge variant="secondary">보조</Badge>
          <Badge variant="outline">아웃라인</Badge>
          <Badge variant="destructive">위험</Badge>
        </ShadcnCardContent>
      </ShadcnCard>

      {/* Avatar 예시 */}
      <ShadcnCard>
        <ShadcnCardHeader>
          <ShadcnCardTitle>Avatar 컴포넌트</ShadcnCardTitle>
          <ShadcnCardDescription>사용자 아바타 예시</ShadcnCardDescription>
        </ShadcnCardHeader>
        <ShadcnCardContent className="space-x-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
        </ShadcnCardContent>
      </ShadcnCard>

      {/* Dialog 예시 */}
      <ShadcnCard>
        <ShadcnCardHeader>
          <ShadcnCardTitle>Dialog 컴포넌트</ShadcnCardTitle>
          <ShadcnCardDescription>모달 다이얼로그 예시</ShadcnCardDescription>
        </ShadcnCardHeader>
        <ShadcnCardContent>
          <Dialog>
            <DialogTrigger asChild>
              <ShadcnButton variant="outline">다이얼로그 열기</ShadcnButton>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>다이얼로그 제목</DialogTitle>
                <DialogDescription>
                  이것은 shadcn/ui Dialog 컴포넌트의 예시입니다.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p>다이얼로그 내용이 여기에 표시됩니다.</p>
              </div>
              <DialogFooter>
                <ShadcnButton variant="outline">취소</ShadcnButton>
                <ShadcnButton>확인</ShadcnButton>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </ShadcnCardContent>
      </ShadcnCard>

      {/* AlertDialog 예시 */}
      <ShadcnCard>
        <ShadcnCardHeader>
          <ShadcnCardTitle>AlertDialog 컴포넌트</ShadcnCardTitle>
          <ShadcnCardDescription>경고 다이얼로그 예시</ShadcnCardDescription>
        </ShadcnCardHeader>
        <ShadcnCardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <ShadcnButton variant="destructive">삭제하기</ShadcnButton>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>정말로 삭제하시겠습니까?</AlertDialogTitle>
                <AlertDialogDescription>
                  이 작업은 되돌릴 수 없습니다. 데이터가 영구적으로 삭제됩니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction>삭제</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </ShadcnCardContent>
      </ShadcnCard>

      {/* DropdownMenu 예시 */}
      <ShadcnCard>
        <ShadcnCardHeader>
          <ShadcnCardTitle>DropdownMenu 컴포넌트</ShadcnCardTitle>
          <ShadcnCardDescription>드롭다운 메뉴 예시</ShadcnCardDescription>
        </ShadcnCardHeader>
        <ShadcnCardContent>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <ShadcnButton variant="outline">메뉴 열기</ShadcnButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>내 계정</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>프로필</DropdownMenuItem>
              <DropdownMenuItem>설정</DropdownMenuItem>
              <DropdownMenuItem>로그아웃</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ShadcnCardContent>
      </ShadcnCard>
    </div>
  );
}
