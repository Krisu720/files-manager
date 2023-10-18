<img src="https://uploadthing.com/f/80e50706-0ed4-4616-aeb1-f6cb3c98b80f-1e.png"/>
<img src="https://uploadthing.com/f/4c40c359-d715-4c0d-9a7d-3a0ac84212c2-1d.png"/>
<img src="https://uploadthing.com/f/6565edc5-9357-4a97-87f2-037fc107c24c-1b4.png"/>

## Demo

https://files-manager-krisu720.vercel.app/

---

<h5>If you dont want to make account you can use demo credentials:</h5>

email:

```bash
demo@demo.com
```
password:

```bash
demo12345
```

## Used Technologies

- [Prisma](https://www.prisma.io/)
- [Radix-ui](https://www.radix-ui.com/)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [next-auth](https://next-auth.js.org/)
- [shadcn-ui](https://ui.shadcn.com/)
- [lucide-react](https://lucide.dev/guide/packages/lucide-react)
- [uuid](https://www.npmjs.com/package/uuid)
- [zod](https://github.com/colinhacks/zod)
- [tailwind](https://tailwindcss.com/)
- [trpc](https://trpc.io/)
- [react-hook-form](https://react-hook-form.com/)
- [next-themes](https://www.npmjs.com/package/next-themes)

## Installation
1.First clone repository or download from github.
```
git clone https://github.com/Krisu720/files-manager
```
2.Then install missing packages using node.
```
pnpm install
```
3.Create .env file which includes:
```
DATABASE_URL=#mysql link#
NEXTAUTH_SECRET=#random letters secret#
NEXTAUTH_URL=#default url for example http://localhost:3000/#
BCRYPT_SALTS=*salts number (13 suggested)*
```
4.Migrate prisma database.
```
npx prisma migrate dev
```

5.After installation run development server.
```
pnpm run dev
```


