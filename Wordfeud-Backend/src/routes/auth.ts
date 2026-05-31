import type { FastifyPluginAsync } from 'fastify';
import prisma from '../prisma/prismaClient';
import * as bcrypt from 'bcrypt';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const jwt = require('jsonwebtoken') as typeof import('jsonwebtoken');

const auth: FastifyPluginAsync = async (fastify) => {
  fastify.post('/api/auth/signup', async (request, reply) => {
    const body = request.body as any;
    const { email, password, username } = body || {};
    if (!email || !password) return reply.status(400).send({ error: 'Missing fields' });
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return reply.status(409).send({ error: 'Email exists' });
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, password: hash, username } });
    return reply.status(201).send({ id: user.id, email: user.email, username: user.username });
  });

  fastify.post('/api/auth/login', async (request, reply) => {
    const body = request.body as any;
    const { email, password } = body || {};
    if (!email || !password) return reply.status(400).send({ error: 'Missing fields' });
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return reply.status(401).send({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return reply.status(401).send({ error: 'Invalid credentials' });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
    return reply.send({ token, username: user.username ?? user.email });
  });
};

export default auth;
