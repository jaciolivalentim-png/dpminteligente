
from fastapi import FastAPI, UploadFile, File, HTTPException
from zip_analyzer import analisar_zip
from pathlib import Path
import tempfile
import os

app = FastAPI(
    title=title="DPM Inteligente",,
    version="1.0.0"
)

@app.get("/")
def inicio():
    return {
        "sistema": "SEAP Inteligente",
        "modulo": "Análise documental",
        "ambiente": "Desenvolvimento"
    }


@app.post("/analisar-zip")
async def receber_zip(
    arquivo: UploadFile = File(...)
):
    if not arquivo.filename.lower().endswith(".zip"):
        raise HTTPException(
            status_code=400,
            detail="Envie um arquivo ZIP."
        )

    caminho = None

    try:
        tamanho = 0

        with tempfile.NamedTemporaryFile(
            suffix=".zip",
            delete=False
        ) as temporario:
            caminho = temporario.name

            while True:
                bloco = await arquivo.read(1024 * 1024)

                if not bloco:
                    break

                tamanho += len(bloco)

                if tamanho > 100 * 1024 * 1024:
                    raise HTTPException(
                        status_code=413,
                        detail="Arquivo acima do limite."
                    )

                temporario.write(bloco)

        resultado = analisar_zip(caminho)

        return {
            "sucesso": True,
            "relatorio": resultado
        }

    except ValueError as erro:
        raise HTTPException(status_code=400, detail=str(erro))

    finally:
        if caminho and os.path.exists(caminho):
            os.remove(caminho)

        await arquivo.close()
