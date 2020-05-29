"use strict";

var filePondRegisterOk = false;

function addFilePondToFormData(id, formData, forcedName) {
	var filePondElement = document.getElementById(id);
	var name = filePondElement.getAttribute("data-pond-original-name");
	var file = filePondElement["data-pond-file"];
	if (file) {
		formData.append(forcedName || name, file);
		return true;
	} else {
		return false;
	}
}

function resetFilePond(id) {
	var filePondElement = document.getElementById(id);
	filePondElement["data-pond-file"] = null;
}

function prepareFilePond(id, includePreview) {
	if (!filePondRegisterOk) {
		filePondRegisterOk = true;
		//FilePond Config
		if (includePreview) {
			FilePond.registerPlugin(
				FilePondPluginImagePreview,
				FilePondPluginFileValidateSize,
				FilePondPluginFileValidateType,
			);
		} else {
			FilePond.registerPlugin(
				FilePondPluginFileValidateSize,
				FilePondPluginFileValidateType,
			);
		}
	}

	const inputImg = document.getElementById(id);
	const name = inputImg.getAttribute("name");
	inputImg.removeAttribute("name");
	inputImg.setAttribute("data-max-file-size", "1MB");
	inputImg.setAttribute("accept", "image/png, image/jpeg, image/gif");

	const pond = FilePond.create(inputImg, {
		labelIdle: `Arraste e solte sua imagem ou <span class="filepond--label-action">selecione um aquivo</span>`,
		labelMaxFileSizeExceeded: "Tamanho do arquivo excedeu o limite de 1MB",
		labelFileTypeNotAllowed: "Tipo do arquivo não permitido (deve ser PNG, JPEG ou GIF)"
	});
	const filePondElement = document.getElementById(id);
	filePondElement.setAttribute("data-pond-original-name", name);
	pond.on("addfile", function (error, file) {
		if (error) {
			return;
		}
		filePondElement["data-pond-file"] = file.file;
	});
}
