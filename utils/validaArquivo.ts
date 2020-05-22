export = function validaArquivo(arquivo: any, tamanhoMaximoEmBytes: number = (1024 * 1024)): boolean {
	return (arquivo && arquivo.buffer && arquivo.size && arquivo.size < tamanhoMaximoEmBytes);
}
