FROM node:16-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

COPY ./next.config.js .
COPY ./public ./public/
COPY --chown=nextjs:nodejs ./.next ./.next/
COPY ./node_modules ./node_modules/
COPY ./package.json .
COPY ./package-lock.json .

USER nextjs

EXPOSE 3000

ENV NEXT_TELEMETRY_DISABLED 1

CMD ["npm", "start"]
