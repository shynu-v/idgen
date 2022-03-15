var pdfmake = require("pdfmake");
const routes = require("express").Router();
const applicationModel = require("../models/applicationModel");
const batchModel = require("../models/batchModel");
const courseModel = require("../models/courseModel");

routes.get("/generate-pdf/", async (req, res) => {
	try {
		console.log(req.user._id);
		const app = await applicationModel.findOne({
			_id: req.user._id,
			isApproved: "approved",
		});
		const { student, phone, photo, ...appstat } = app._doc;
		const batch = await batchModel.findOne({ _id: appstat.batch });
		const { batchName } = batch._doc;
		const course = await courseModel.findOne({ _id: appstat.course });
		const { name } = course._doc;
		const doc = new pdfmake({
			Roboto: {
				normal: new Buffer(
					require("pdfmake/build/vfs_fonts.js").pdfMake.vfs["Roboto-Regular.ttf"],
					"base64"
				),
			},
		}).createPdfKitDocument({
			content: [
				{ text: "ICTAK", style: "header", alignment: "center" },
				{
					image: photo,
					width: 150,
					height: 150,
					alignment: "center",
				},
				{ text: name, style: "header", alignment: "center" },
				{ text: batchName, style: "header", alignment: "center" },
			],
		});
		var chunks = [];
		var result;
		doc.on("readable", function () {
			var chunk;
			while ((chunk = doc.read(9007199254740991)) !== null) {
				chunks.push(chunk);
			}
		});
		doc.on("end", function () {
			result = Buffer.concat(chunks);
			res.setHeader("Content-Type", "application/pdf");
			res.setHeader("Content-disposition", "attachment; filename=idcard.pdf");
			res.send(result);
		});
		doc.end();
	} catch (error) {
		res.json(error);
	}
});

module.exports = routes;
