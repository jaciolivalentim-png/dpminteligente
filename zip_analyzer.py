
import zipfile
import os
from pathlib import PurePosixPath

TIPOS_PERMITIDOS = {
    ".pdf": "Documento PDF",
    ".docx": "Documento Word",
    ".doc": "Documento Word antigo",
    ".jpg": "Imagem",
    ".jpeg": "Imagem",
    ".png": "Imagem",
    ".tif": "Imagem digitalizada",
    ".tiff": "Imagem digitalizada",
    ".txt": "Texto"
}

TAMANHO_MAXIMO = 100 * 1024 * 1024
MAX_ARQUIVOS = 500


def analisar_zip(caminho):
    if not zipfile.is_zipfile(caminho):
        raise ValueError("Arquivo ZIP inválido.")

    resultado = []

    with zipfile.ZipFile(caminho, "r") as arquivo_zip:
        itens = arquivo_zip.infolist()

        if len(itens) > MAX_ARQUIVOS:
            raise ValueError("Quantidade excessiva de arquivos.")

        tamanho_total = sum(item.file_size for item in itens)

        if tamanho_total > TAMANHO_MAXIMO:
            raise ValueError("ZIP excede o limite permitido.")

        for item in itens:
            if item.is_dir():
                continue

            nome = item.filename
            caminho_seguro = PurePosixPath(nome)

            if caminho_seguro.is_absolute() or ".." in caminho_seguro.parts:
                raise ValueError("Caminho inseguro encontrado no ZIP.")

            extensao = os.path.splitext(nome)[1].lower()

            resultado.append({
                "arquivo": caminho_seguro.name,
                "caminho": nome,
                "extensao": extensao,
                "tipo": TIPOS_PERMITIDOS.get(
                    extensao,
                    "Formato não reconhecido"
                ),
                "tamanho": item.file_size,
                "status": "Aguardando leitura"
            })

    return {
        "quantidade": len(resultado),
        "documentos": resultado
    }
