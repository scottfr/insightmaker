var InsightMakerFileExtension = ".InsightMaker";

// Append file extension to file (if not already there)
function appendFileExtension(filename,extension) {
	var extension_position=filename.length-extension.length;
	var current_extension=filename.slice(extension_position);
	if(current_extension.toLowerCase()!=extension.toLowerCase()) {
		filename+=extension;
	}
	return filename;
}

// Set the title to include the model name
function setTitle(filename) {
	var title;
	if(filename!=null) {
		title = filename+"| Insight Maker";
		
	} else {
		title = "Insight Maker";
	}
	window.parent.document.title = title;
}

// Get xml data for the current model
function getModelXML() {
	var enc = new mxCodec();
	var graph_dom=enc.encode(graph.getModel());
	var xml_data="<InsightMakerModel>"+graph_dom.innerHTML+"</InsightMakerModel>";
	return xml_data;
}

// Makes a new model
function newModel() {
	clearModel();
}

// Class for uploading and downloading files from javascript
var WebFileIO = new function() {
	var upload_handler;
	function readfile(event) {
		var file = event.target.files[0]; 

		if (file) {
		  var reader = new FileReader();
		  reader.onload = function(reader_event) { 
			  var filedata = reader_event.target.result;
			  upload_handler(file.name, filedata);	
		  }
		  reader.readAsText(file);
		}
	}

	this.upload = function(tupload_handler, accepttype) {
		var uploader = document.body.appendChild(document.createElement("input"));
		uploader.addEventListener('change', readfile, false);
		uploader.type="file";
		if(accepttype!==undefined) {
			// accepttype is file extension that we should show
			// E.g. ".txt"
			// If none is specified all file extensions are shown
			uploader.accept=accepttype;
		}
		upload_handler = tupload_handler;
		
		uploader.click();
		uploader.parentElement.removeChild(uploader);
	};
	
	this.download = function(filename, content) {
		var downloadlink = document.body.appendChild(document.createElement("a"));
		downloadlink.download = filename;
		
		downloadlink.href = "data:text/plain;base64," + btoa(content);
		downloadlink.click();
		downloadlink.parentElement.removeChild(downloadlink);
	};
}

// High-level File manager. Does save and load of models
var FileManagerWeb = new function() {
	var self = this;
	var filename = null;
	
	this.set_filename = function(filename) {
		self.filename=filename;
		setTitle(filename);
	}
	
	this.saveModel = function() {
		var xml_data = getModelXML();
		


		var model_name=prompt("Enter name of model");
		if(model_name==null) {
			return;
		}
		model_name=appendFileExtension(model_name,InsightMakerFileExtension);
		self.set_filename(model_name);
		WebFileIO.download(model_name,xml_data);
	};
	
	this.loadModel = function() {
		WebFileIO.upload(function(filename,model_data) {
		importMXGraph(model_data);
		self.set_filename(filename);
		},InsightMakerFileExtension);
	};
	
	this.newModel = function() {
		self.set_filename(null);
		newModel();
	}
};

// FileMenu for environment.WebOffline
var FileMenuWeb = {
text: getText('File'),
itemId: "filegroup",
glyph: 0xf15b,
menu: [
	{
		glyph: 0xf016,
		text: getText('New'),
		tooltip: getText('New model'),
		handler: FileManagerWeb.newModel,
		scope: this
	}, 
	{
		glyph: 0xf115, /*0xf115 alternative icon we could have used */
		text: getText('Load'),
		tooltip: getText('Load model'),
		handler: FileManagerWeb.loadModel,
		scope: this
	}, 
	{
		glyph: 0xf0c7,
		text: getText('Save'),
		tooltip: getText('Save model'),
		handler: FileManagerWeb.saveModel,
		scope: this
	}
]
};

// Get the correct FileMenu depending on the environment
var FileMenu;
switch(viewConfig.environment) {
	case environment.InsightMakerOnline:
		FileMenu = [];
		break;
	case environment.WebOffline:
		FileMenu = [FileMenuWeb];
		break;
}
