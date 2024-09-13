"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link"
import Logo from "@/lib/media/logo.svg";
import Image from "next/image";

export default function Component() {
  const [modelos, setModelos] = useState([
    { id: 1, nome: "Mensagem de Boas-Vindas", conteudo: "Olá {nome}, bem-vindo(a) à nossa plataforma." },
    { id: 2, nome: "Atualização Semanal", conteudo: "Olá {nome}. Aqui está a atualização semanal para você." },
    { id: 3, nome: "Lembrete", conteudo: "Olá {nome}. Não se esqueça de {acao} em {data}." },
  ]);

  const [novoNomeModelo, setNovoNomeModelo] = useState("");
  const [novoConteudoModelo, setNovoConteudoModelo] = useState("");
  const [editarModelo, setEditarModelo] = useState<number | null>(null);

  const handleAddModelo = () => {
    if (novoNomeModelo && novoConteudoModelo) {
      setModelos([
        ...modelos,
        {
          id: modelos.length + 1,
          nome: novoNomeModelo,
          conteudo: novoConteudoModelo,
        },
      ]);
      setNovoNomeModelo("");
      setNovoConteudoModelo("");
    }
  };

  const handleEditModelo = (id: number) => {
    const modelo = modelos.find((m) => m.id === id);
    if (modelo) {
      setNovoNomeModelo(modelo.nome);
      setNovoConteudoModelo(modelo.conteudo);
      setEditarModelo(id);
    }
  };

  const handleSaveEdit = () => {
    if (editarModelo !== null && novoNomeModelo && novoConteudoModelo) {
      setModelos(
        modelos.map((modelo) =>
          modelo.id === editarModelo
            ? { ...modelo, nome: novoNomeModelo, conteudo: novoConteudoModelo }
            : modelo
        )
      );
      setNovoNomeModelo("");
      setNovoConteudoModelo("");
      setEditarModelo(null);
    }
  };

  const handleDeleteModelo = (id: number) => {
    setModelos(modelos.filter((modelo) => modelo.id !== id));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-6 space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Modelos Existentes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {modelos.map((modelo) => (
              <Card key={modelo.id} className="shadow-lg rounded-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">{modelo.nome}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{modelo.conteudo}</p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button
                   
                    className=" text-white"
                    onClick={() => handleEditModelo(modelo.id)}
                  >
                    Editar
                  </Button>
                  <Button
                 
                    className=" text-white"
                    onClick={() => handleDeleteModelo(modelo.id)}
                  >
                    Excluir
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-lg space-y-6">
  <h2 className="text-3xl font-bold text-gray-800">
    {editarModelo ? "Editar Modelo" : "Adicionar Novo Modelo"}
  </h2>
  <form
    className="space-y-6"
    onSubmit={(e) => {
      e.preventDefault();
      editarModelo !== null ? handleSaveEdit() : handleAddModelo();
    }}
  >
    <div className="relative">
      <Label
        htmlFor="title"
        className="absolute -top-3 left-2 bg-white px-2 text-sm font-semibold text-gray-600"
      >
        Título
      </Label>
      <Input
        id="title"
        placeholder="Título da mensagem"
        className="border-gray-300 border-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={novoNomeModelo}
        onChange={(e) => setNovoNomeModelo(e.target.value)}
      />
    </div>
    <div className="relative">
      <Label
        htmlFor="content"
        className="absolute -top-3 left-2 bg-white px-2 text-sm font-semibold text-gray-600"
      >
        Conteúdo
      </Label>
      <Textarea
        id="content"
        placeholder="Conteúdo da mensagem"
        className="border-gray-300 border-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={novoConteudoModelo}
        onChange={(e) => setNovoConteudoModelo(e.target.value)}
      />
    </div>
    <Button
    
      className=" text-white px-6 py-3 rounded-lg text-lg font-medium shadow-md transform transition-transform hover:scale-105"
      type="submit"
    >
      {editarModelo ? "Salvar Alterações" : "Adicionar"}
    </Button>

  </form>
</div>

      </div>
    </div>
  );
}
