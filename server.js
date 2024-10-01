import express from "express";
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const app = express();
const supabaseUrl ='https://bnbeyejgjwhneesdnxbw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJuYmV5ZWpnandobmVlc2RueGJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjczMDc2MDAsImV4cCI6MjA0Mjg4MzYwMH0.i7Y-TJlMMRAeGp7FHLQlRJ8Vvk5-YmGMzcL8TZIMYWk';
const supabase = createClient(supabaseUrl, supabaseKey);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // This will work now

async function criarUsuario(nome, data_aniversario) {
    const { data, error } = await supabase
        .from('membros')
        .insert([{ nome, data_aniversario }]);

    if (error) {
        console.error('Erro ao criar usuário:', error);
    } else {
        console.log('Usuário criado:', nome);
    }
}

async function criarUsuarioCasamento(nome, data_aniversario) {
	 const { data, error } = await supabase
		 .from('aniversarios_casamento')
		 .insert([{ nome, data_aniversario }]);
	if (error) {
		console.error('Erro ao criar usuário:',error);
	} else {
		console.log('Usuário Criado:',nome);
	}

}
async function lerUsuarios() {
    const { data, error } = await supabase
        .from('membros')
        .select('*')
        .order('data_aniversario', { ascending: true});


    if (error) {
        console.error('Erro ao ler usuários:', error);
        return [];
    }
    return data;
}
async function lerUsuariosCasamento() {
    const { data, error } = await supabase
        .from('aniversarios_casamento')
        .select('*')
        .order('data_aniversario', { ascending: true});


    if (error) {
        console.error('Erro ao ler usuários:', error);
        return [];
    }
    return data;
}
app.get('/', async (req, res) => {
    const usuarios = await lerUsuarios();
    res.render('index', { usuarios });
});
app.get('/casamento', async (req, res) => {
    const usuarios = await lerUsuariosCasamento();
    res.render('index1', { usuarios });
});
app.post('/criar-usuario', async (req, res) => {
    const { nome, data_aniversario } = req.body;
    await criarUsuario(nome, data_aniversario);
    const usuarios = await lerUsuarios();
    res.render('index', { usuarios });
});
app.post('/criar-usuario-casamento', async (req, res) => {
    const { nome, data_aniversario } = req.body;
    await criarUsuarioCasamento(nome, data_aniversario);
    const usuarios = await lerUsuariosCasamento();
    res.render('index1', { usuarios });
});
app.post('/editar-usuario', async (req, res) => {
    const { id, nome, data_aniversario } = req.body;
    await editarUsuario(id, nome, data_aniversario);
    const usuarios = await lerUsuarios();
    res.render('index', { usuarios });
});
app.post('/editar-usuario-casamento', async (req, res) => {
    const { id, nome, data_aniversario } = req.body;
    await editarUsuarioCasamento(id, nome, data_aniversario);
    const usuarios = await lerUsuariosCasamento();
    res.render('index1', { usuarios });
});
app.get('/deletar-usuario/:id', async (req, res) => {
    const { id } = req.params;
    await deletarUsuario(id);
    const usuarios = await lerUsuarios();
    res.render('index', { usuarios });
});
app.get('/deletar-usuario-casamento/:id', async (req, res) => {
    const { id } = req.params;
    await deletarUsuarioCasamento(id);
    const usuarios = await lerUsuariosCasamento();
    res.render('index1', { usuarios });
});
async function editarUsuario(id, nome, data_aniversario) {
    const { data, error } = await supabase
        .from('membros')
        .update({ nome, data_aniversario })
        .eq('id', id);

    if (error) {
        console.error('Erro ao editar usuário:', error);
    } else {
        console.log('Usuário editado:', nome);
    }
}
async function editarUsuarioCasamento(id, nome, data_aniversario) {
    const { data, error } = await supabase
        .from('aniversarios_casamento')
        .update({ nome, data_aniversario })
        .eq('id', id);

    if (error) {
        console.error('Erro ao editar usuário:', error);
    } else {
        console.log('Usuário editado:', nome);
    }
}
async function deletarUsuario(id) {
    const { data, error } = await supabase
        .from('membros')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Erro ao deletar usuário:', error);
    } else {
        console.log('Usuário deletado:', id);
    }
}
async function deletarUsuarioCasamento(id) {
    const { data, error } = await supabase
        .from('aniversarios_casamento')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Erro ao deletar usuário:', error);
    } else {
        console.log('Usuário deletado:', id);
    }
}

app.listen(3000, async () => {
    console.log("Servidor rodando na porta 3000...");
});