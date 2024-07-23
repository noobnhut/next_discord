# next_discord
+ nextjs mysql prisma socketio
+ shadcn/ui tailwincss
+ Setup source-code:
-  npx create-next-app@latest discord-clone --typescript --tailwind --eslint
+ no src/ , yes app router, no alias
+ npx shadcn-ui@latest init => typescript,default,stone,enter,yes,...,yes
+ npx shadcn-ui@latest add button => add 1 component from shadcn
+ npm run dev

## setup authentication
### using clerk: 
+ https://viblo.asia/p/nextjs-quan-ly-nguoi-dung-rat-don-gian-nhat-voi-clerk-yZjJYKeOVOE
+ https://clerk.com/docs/references/nextjs/custom-signup-signin-pages

## setup dark mode
- npm i next-themes
- https://ui.shadcn.com/docs/dark-mode/next
- dropdown-menu: npx shadcn-ui@latest add dropdown-menu

## setup prisma 
- https://vticloud.io/serverless-database/
- https://www.marketenterprise.vn/blog/prisma-ho-tro-phat-trien-phan-1.html
### setup prisma
- npm i -D prisma
- npx prisma init
- npx prisma generate
- npx prisma db push
- npm i @prisma/client