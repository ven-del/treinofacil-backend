const supabase = require('../config/supabaseClient');

const userModel = require('../models/userModel');

const authController = {

    async registerUser(req, res) {
        const { email, password, nome, tipo } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email e senha são obrigatórios para o registro." });
        }

        try {
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: email,
                password: password,
            });

            if (authError) {
                console.error('Erro de registro no Supabase Auth:', authError.message);
                return res.status(400).json({
                    message: "Falha no registro.",
                    error: authError.message
                });
            }
            if (!authData.user) {
                return res.status(202).json({
                    message: "Registro bem-sucedido. Verifique seu email para confirmar a conta.",
                    user: authData.user || null
                });
            }

            const newUserData = {
                id: authData.user.id,
                nome: nome,
                email: email,
                tipo: tipo || 'aluno'
            };
            const newUserInDB = await userModel.createUser(newUserData);

            return res.status(201).json({
                message: "Usuário registrado e logado com sucesso.",
                session: authData.session, 
                user: newUserInDB
            });

        } catch (error) {
            console.error('Erro interno no registro de usuário:', error.message);
            return res.status(500).json({
                message: "Erro interno do servidor durante o registro.",
                error: error.message
            });
        }
    },

    async loginUser(req, res) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email e senha são obrigatórios para o login." });
        }

        try {
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (authError) {
                console.error('Erro de login no Supabase Auth:', authError.message);
                return res.status(401).json({
                    message: "Falha no login.",
                    error: authError.message
                });
            }
            const userInDB = await userModel.findUserById(authData.user.id);

            return res.status(200).json({
                message: "Login bem-sucedido.",
                session: authData.session,
                user: userInDB
            });

        } catch (error) {
            console.error('Erro interno no login de usuário:', error.message);
            return res.status(500).json({
                message: "Erro interno do servidor durante o login.",
                error: error.message
            });
        }
    },

    async logoutUser(req, res) {
        
        try {
            const { error } = await supabase.auth.signOut();

            if (error) {
                console.error('Erro ao fazer logout no Supabase Auth:', error.message);
                return res.status(500).json({
                    message: "Falha ao fazer logout.",
                    error: error.message
                });
            }

            return res.status(200).json({ message: "Logout bem-sucedido." });

        } catch (error) {
            console.error('Erro interno no logout de usuário:', error.message);
            return res.status(500).json({
                message: "Erro interno do servidor durante o logout.",
                error: error.message
            });
        }
    },

    async resetPassword(req, res) {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email é obrigatório para redefinir a senha." });
        }

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
            });

            if (error) {
                console.error('Erro ao iniciar redefinição de senha:', error.message);
                return res.status(500).json({
                    message: "Não foi possível iniciar o processo de redefinição de senha.",
                    error: error.message
                });
            }

            return res.status(200).json({
                message: "Um link para redefinir sua senha foi enviado para seu email."
            });

        } catch (error) {
            console.error('Erro interno na redefinição de senha:', error.message);
            return res.status(500).json({
                message: "Erro interno do servidor durante a redefinição de senha.",
                error: error.message
            });
        }
    },

    async confirmEmail(req, res) {
        const { token_hash, type } = req.body; // Supabase geralmente envia estes na URL

        if (!token_hash || !type) {
            return res.status(400).json({ message: "Token e tipo de confirmação são obrigatórios." });
        }

        try {
            const { data: authData, error: authError } = await supabase.auth.verifyOtp({
                token_hash: token_hash,
                type: type // 'signup', 'invite', 'recovery', 'email_change'
            });

            if (authError) {
                console.error('Erro ao confirmar email:', authError.message);
                return res.status(400).json({
                    message: "Não foi possível confirmar o email.",
                    error: authError.message
                });
            }
            const userInDB = await userModel.findUserById(authData.user.id);

            return res.status(200).json({
                message: "Email confirmado com sucesso.",
                session: authData.session,
                user: userInDB
            });

        } catch (error) {
            console.error('Erro interno na confirmação de email:', error.message);
            return res.status(500).json({
                message: "Erro interno do servidor durante a confirmação de email.",
                error: error.message
            });
        }
    }
};

module.exports = authController;