INSERT INTO "treino-facil".dias_treino (id, treino_id, dia_semana) VALUES
  ('40000000-0000-0000-0000-000000000001', 'db44a9df-b24f-482e-a42d-0a87266b4408', 'segunda'),
  ('40000000-0000-0000-0000-000000000002', 'b2511c40-0156-4b5f-95c1-abc1209785f2', 'quarta'),
  ('40000000-0000-0000-0000-000000000003', '9128a1d1-25b5-42a9-a784-32c6ac83b7df', 'sexta')
ON CONFLICT (id) DO UPDATE SET
    treino_id = EXCLUDED.treino_id,
    dia_semana = EXCLUDED.dia_semana;

-- Treino Exercícios para Dan Heng (usando os IDs existentes e referenciando os exercícios)
INSERT INTO "treino-facil".treino_exercicios (id, treino_id, exercicio_id, ordem, series, repeticoes, carga, carga_atual, observacoes_professor) VALUES
  ('5fb70e11-9d1e-4966-b04f-76f75f18d71c', 'db44a9df-b24f-482e-a42d-0a87266b4408', '20cf2be9-2b4e-4d6b-a23c-f73789cb28a7', 1, 4, 8, 80, 75, 'Manter a barra na linha do peito.'),
  ('c2d037ce-471b-44f6-9277-1435459f8a86', 'db44a9df-b24f-482e-a42d-0a87266b4408', '2f3a140a-ba1f-4581-9e15-1260b8ca9b28', 2, 4, 10, 100, 95, 'Atingir profundidade máxima.'),
  ('55ef20e0-35d8-4ed9-94c6-f3a248c25aab', 'db44a9df-b24f-482e-a42d-0a87266b4408', '8d38d21e-fe8a-4046-86e6-4046a92df7a4', 3, 3, 12, 50, 45, 'Controlar a descida.'),
  ('60982186-3a9b-401f-a237-00b694b37ea5', 'b2511c40-0156-4b5f-95c1-abc1209785f2', 'a2ac88a9-99db-4c3a-bcc3-2a28dc58371b', 1, 3, 15, 10, 10, 'Fazer com controle e sem forçar o pescoço.'),
  ('dc75bc8e-76dd-4ad5-82f1-afdb12ba9a1c', 'b2511c40-0156-4b5f-95c1-abc1209785f2', '7f187684-cd7c-4528-b9ea-789f7aa05e88', 2, 3, 12, 30, 28, 'Manter a postura ereta.'),
  ('1e0af69f-2f92-442e-b6df-b7dc347ee184', '9128a1d1-25b5-42a9-a784-32c6ac83b7df', '468131b8-1487-4caa-a389-bb1800250d4b', 1, 3, 10, 60, 55, 'Priorizar a técnica sobre a carga.'),
  ('50000000-0000-0000-0000-000000000004', 'db44a9df-b24f-482e-a42d-0a87266b4408', '10000000-0000-0000-0000-000000000005', 4, 3, 10, 10, 10, 'Manter o corpo reto.'),
  ('50000000-0000-0000-0000-000000000005', 'b2511c40-0156-4b5f-95c1-abc1209785f2', '10000000-0000-0000-0000-000000000006', 3, 3, 60, 10, 10, 'Contrair o abdômen.'),
  ('50000000-0000-0000-0000-000000000006', '9128a1d1-25b5-42a9-a784-32c6ac83b7df', '10000000-0000-0000-0000-000000000007', 2, 3, 12, 20, 20, 'Manter o equilíbrio.'),
  ('50000000-0000-0000-0000-000000000007', 'db44a9df-b24f-482e-a42d-0a87266b4408', '10000000-0000-0000-0000-000000000008', 5, 3, 15, 10, 10, 'Movimento controlado.'),
  ('50000000-0000-0000-0000-000000000008', 'b2511c40-0156-4b5f-95c1-abc1209785f2', '10000000-0000-0000-0000-000000000009', 4, 4, 20, 10, 10, 'Elevar ao máximo.'),
  ('50000000-0000-0000-0000-000000000009', '9128a1d1-25b5-42a9-a784-32c6ac83b7df', '10000000-0000-0000-0000-000000000001', 3, 4, 10, 70, 70, 'Foco na contração.'),
  ('50000000-0000-0000-0000-000000000010', 'db44a9df-b24f-482e-a42d-0a87266b4408', '10000000-0000-0000-0000-000000000002', 6, 4, 12, 90, 90, 'Cuidado com os joelhos.'),
  ('50000000-0000-0000-0000-000000000011', 'b2511c40-0156-4b5f-95c1-abc1209785f2', '10000000-0000-0000-0000-000000000003', 5, 4, 10, 45, 45, 'Puxar com as costas.'),
  ('50000000-0000-0000-0000-000000000012', '9128a1d1-25b5-42a9-a784-32c6ac83b7df', '10000000-0000-0000-0000-000000000004', 4, 3, 10, 35, 35, 'Elevar acima da cabeça.')
ON CONFLICT (id) DO UPDATE SET
    treino_id = EXCLUDED.treino_id,
    exercicio_id = EXCLUDED.exercicio_id,
    ordem = EXCLUDED.ordem,
    series = EXCLUDED.series,
    repeticoes = EXCLUDED.repeticoes,
    carga = EXCLUDED.carga,
    carga_atual = EXCLUDED.carga_atual,
    observacoes_professor = EXCLUDED.observacoes_professor;

INSERT INTO "treino-facil".calendario_treino (id, aluno_id, treino_id, data, status) VALUES
  ('60000000-0000-0000-0000-000000000001', '97b45ffe-0f8a-4c3b-9197-a73f7877bf2a', 'db44a9df-b24f-482e-a42d-0a87266b4408', '2025-06-19', 'pendente'),
  ('60000000-0000-0000-0000-000000000002', '97b45ffe-0f8a-4c3b-9197-a73f7877bf2a', 'b2511c40-0156-4b5f-95c1-abc1209785f2', '2025-06-20', 'pendente'),
  ('60000000-0000-0000-0000-000000000003', '97b45ffe-0f8a-4c3b-9197-a73f7877bf2a', '9128a1d1-25b5-42a9-a784-32c6ac83b7df', '2025-06-21', 'pendente'),
  ('60000000-0000-0000-0000-000000000004', '97b45ffe-0f8a-4c3b-9197-a73f7877bf2a', 'db44a9df-b24f-482e-a42d-0a87266b4408', '2025-06-22', 'pendente'),
  ('60000000-0000-0000-0000-000000000005', '97b45ffe-0f8a-4c3b-9197-a73f7877bf2a', 'b2511c40-0156-4b5f-95c1-abc1209785f2', '2025-06-23', 'pendente'),
  ('60000000-0000-0000-0000-000000000006', '97b45ffe-0f8a-4c3b-9197-a73f7877bf2a', '9128a1d1-25b5-42a9-a784-32c6ac83b7df', '2025-06-24', 'pendente'),
  ('60000000-0000-0000-0000-000000000007', '97b45ffe-0f8a-4c3b-9197-a73f7877bf2a', 'db44a9df-b24f-482e-a42d-0a87266b4408', '2025-06-25', 'pendente'),
  ('60000000-0000-0000-0000-000000000008', '97b45ffe-0f8a-4c3b-9197-a73f7877bf2a', 'b2511c40-0156-4b5f-95c1-abc1209785f2', '2025-06-26', 'pendente'),
  ('60000000-0000-0000-0000-000000000009', '97b45ffe-0f8a-4c3b-9197-a73f7877bf2a', '9128a1d1-25b5-42a9-a784-32c6ac83b7df', '2025-06-27', 'pendente'),
  ('60000000-0000-0000-0000-000000000010', '97b45ffe-0f8a-4c3b-9197-a73f7877bf2a', 'db44a9df-b24f-482e-a42d-0a87266b4408', '2025-06-28', 'pendente')
ON CONFLICT (id) DO UPDATE SET
    aluno_id = EXCLUDED.aluno_id,
    treino_id = EXCLUDED.treino_id,
    data = EXCLUDED.data,
    status = EXCLUDED.status;

INSERT INTO "treino-facil".quests (id, aluno_id, professor_id, titulo, descricao, recompensa, data_inicio, data_fim, status) VALUES
  ('70000000-0000-0000-0000-000000000001', '97b45ffe-0f8a-4c3b-9197-a73f7877bf2a', '00000000-0000-0000-0000-000000000001', 'Completar 3 treinos de força', 'Realize 3 treinos de força esta semana para ganhar um bônus de XP.', '500 XP', '2025-06-17', '2025-06-23', 'pendente'),
  ('70000000-0000-0000-0000-000000000002', '97b45ffe-0f8a-4c3b-9197-a73f7877bf2a', '00000000-0000-0000-0000-000000000001', 'Alcançar 100kg no Agachamento', 'Aumente sua carga no agachamento para 100kg e registre seu progresso.', 'Medalha de Força', '2025-06-01', '2025-07-01', 'pendente'),
  ('70000000-0000-0000-0000-000000000003', '97b45ffe-0f8a-4c3b-9197-a73f7877bf2a', '00000000-0000-0000-0000-000000000001', 'Fazer 50 abdominais', 'Complete 50 abdominais em um único treino.', '100 XP', '2025-06-19', '2025-06-26', 'pendente'),
  ('70000000-0000-0000-0000-000000000004', '97b45ffe-0f8a-4c3b-9197-a73f7877bf2a', '00000000-0000-0000-0000-000000000001', 'Correr 5km', 'Complete uma corrida de 5km.', 'Medalha de Velocidade', '2025-06-19', '2025-07-19', 'pendente'),
  ('70000000-0000-0000-0000-000000000005', '97b45ffe-0f8a-4c3b-9197-a73f7877bf2a', '00000000-0000-0000-0000-000000000001', 'Atingir 5 treinos concluídos', 'Conclua 5 treinos registrados no aplicativo.', '200 XP', '2025-06-01', '2025-07-01', 'pendente'),
  ('70000000-0000-0000-0000-000000000006', '97b45ffe-0f8a-4c3b-9197-a73f7877bf2a', '00000000-0000-0000-0000-000000000001', 'Fazer 100 flexões', 'Complete 100 flexões em um único dia.', 'Medalha de Resistência', '2025-06-19', '2025-06-26', 'pendente'),
  ('70000000-0000-0000-0000-000000000007', '97b45ffe-0f8a-4c3b-9197-a73f7877bf2a', '00000000-0000-0000-0000-000000000001', 'Treinar 7 dias seguidos', 'Complete um treino por 7 dias consecutivos.', '500 XP', '2025-06-19', '2025-06-26', 'pendente'),
  ('70000000-0000-0000-0000-000000000008', '97b45ffe-0f8a-4c3b-9197-a73f7877bf2a', '00000000-0000-0000-0000-000000000001', 'Beber 2L de água por dia', 'Registre o consumo de 2 litros de água diariamente por uma semana.', 'Medalha de Hidratação', '2025-06-19', '2025-06-26', 'pendente'),
  ('70000000-0000-0000-0000-000000000009', '97b45ffe-0f8a-4c3b-9197-a73f7877bf2a', '00000000-0000-0000-0000-000000000001', 'Dormir 8 horas por noite', 'Mantenha um padrão de sono de 8 horas por noite por 5 dias.', '100 XP', '2025-06-19', '2025-06-26', 'pendente'),
  ('70000000-0000-0000-0000-000000000010', '97b45ffe-0f8a-4c3b-9197-a73f7877bf2a', '00000000-0000-0000-0000-000000000001', 'Comer 3 porções de vegetais', 'Consuma 3 porções de vegetais por dia durante 3 dias.', 'Medalha de Nutrição', '2025-06-19', '2025-06-22', 'pendente')
ON CONFLICT (id) DO UPDATE SET
    aluno_id = EXCLUDED.aluno_id,
    professor_id = EXCLUDED.professor_id,
    titulo = EXCLUDED.titulo,
    descricao = EXCLUDED.descricao,
    recompensa = EXCLUDED.recompensa,
    data_inicio = EXCLUDED.data_inicio,
    data_fim = EXCLUDED.data_fim,
    status = EXCLUDED.status;
