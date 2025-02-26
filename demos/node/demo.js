/*
 * NAME: demo.js
 * AUTH: Brent Ely (https://github.com/gitbrent/)
 * DATE: 20210502
 * DESC: PptxGenJS feature demos for Node.js
 * REQS: npm 4.x + `npm install pptxgenjs`
 *
 * USAGE: `node demo.js`       (runs local tests with callbacks etc)
 * USAGE: `node demo.js All`   (runs all pre-defined tests in `../common/demos.js`)
 * USAGE: `node demo.js Text`  (runs pre-defined single test in `../common/demos.js`)
 */

import { execGenSlidesFuncs, runEveryTest } from "../modules/demos.mjs";
import pptxgen from "hcpptxgenjs";

// ============================================================================

const exportName = "PptxGenJS_Demo_Node";
let pptx = new pptxgen();

console.log(`\n\n--------------------==~==~==~==[ STARTING DEMO... ]==~==~==~==--------------------\n`);
console.log(`* pptxgenjs ver: ${pptx.version}`);
console.log(`* save location: ${process.cwd()}`);

function pxToPt(px, dpi = 96) {
	// 1pt = 1/72 inch, 1px = 1/dpi inch
	// 因此 1px = (72 / dpi) pt
	return px * (72 / dpi);
}

function pixelsToDXA(pixels, dpi = 96) {
	// 1英寸 = 72磅 = 1440 DXA (因 1磅=20 DXA)
	const dxaPerInch = 1440; // 72磅/英寸 * 20 DXA/磅
	return Math.round((pixels * dxaPerInch) / dpi);
}

// 进阶用法：如需转换为EMU
function dxaToEMU(dxa) {
	return dxa * 635; // 1 DXA = 635 EMU
}

function pixelsToEMU(pixels) {
	// 1英寸 = 914400 EMU，假设屏幕DPI为96像素/英寸
	const emuPerInch = 914400;
	const pixelsPerInch = 96;
	// 计算每个像素对应的EMU值，并四舍五入取整
	return Math.round((pixels * emuPerInch) / pixelsPerInch);
}

if (process.argv.length > 2) {
	// A: Run predefined test from `../common/demos.js` //-OR-// Local Tests (callbacks, etc.)
	Promise.resolve()
		.then(() => {
			if (process.argv[2].toLowerCase() === "all") return runEveryTest(pptxgen);
			return execGenSlidesFuncs(process.argv[2], pptxgen);
		})
		.catch((err) => {
			throw new Error(err);
		})
		.then((fileName) => {
			console.log(`EX1 exported: ${fileName}`);
		})
		.catch((err) => {
			console.log(`ERROR: ${err}`);
		});
} else {
	// B: Omit an arg to run only these below
	let slide = pptx.addSlide();
	slide.addText(
		[
			{
				text: "测试测试菜单测试的所产生的冯绍峰大大实得分阿斯顿飞啊的覆盖申达股份申达股份",
				options: {
					color: "#386d52",
					objectName: "Text 0",
					line: {},
					lineSpacing: null,
					lineSpacingMultiple: 1.2,		
					paraSpaceBefore: 3.6,
					x: 3.3439390120967745,
					y: 1.0701684907834101,
					w: 2.880184331797235,
					h: 0.92,
					fontSize: 11.52,
					fontFace: "Source Han Sans CN Regular",
					valign: "top",
					margin: 7.2,
					autoFit: true,
					firstIndent: 952500,
				},
			},
		],
		{
			x: 3.3439390120967745,
			y: 1.0701684907834101,
			w: 2.880184331797235,
			h: 0.92,
			fontSize: 11.52,
			fontFace: "Source Han Sans CN Regular",
			color: "#386d52",
			valign: "top",
			margin: 7.2,
			paraSpaceBefore: 3.6,
			lineSpacingMultiple: 1.2,
			autoFit: true,
			firstIndent: 952500,
			objectName: "Text 0",
			line: {},
			lineSpacing: null,
		}
	);
	// slide.addImage({
	// 	data: "data:image/jpeg;base64,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",
	// 	x: 2.0127014544025155,
	// 	y: 3.6334389740566035,
	// 	w: 2,
	// 	h: 2,
	// 	outline: {
	// 		size: pixelsToEMU(10), //12700,
	// 		color: "000000",
	// 		style: "dashed",
	// 	},
	// 	radius: true,
	// });

	// slide.addShape(pptx.shapes.OVAL, {
	// 	x: 2,
	// 	y: 2,
	// 	w: 3,
	// 	h: 2,
	// 	fill: "00FF00",
	// 	line: "000000",
	// 	lineSize: 1,
	// 	gradient: {
	// 		type: "circle",
	// 		rotate: 90,
	// 		colors: [
	// 			{
	// 				pos: 0,
	// 				color: "#d55b5b",
	// 				alpha: 0,
	// 			},
	// 			{
	// 				pos: 40,
	// 				color: "#cdd55b",
	// 				alpha: 0,
	// 			},
	// 			{
	// 				pos: 72,
	// 				color: "#5bb9d5",
	// 				alpha: 51,
	// 			},
	// 			{
	// 				pos: 100,
	// 				color: "#ffffff",
	// 				alpha: 0,
	// 			},
	// 		],
	// 	},
	// });
	// slide.addShape(pptx.shapes.OVAL_CALLOUT, { x: 6, y: 2, w: 3, h: 2, fill: "00FF00", line: "000000", lineSize: 1 }); // Test shapes availablity

	// EXAMPLE 1: Saves output file to the local directory where this process is running
	pptx.writeFile({ fileName: exportName })
		.catch((err) => {
			throw new Error(err);
		})
		.then((fileName) => {
			console.log(`EX1 exported: ${fileName}`);
		})
		.catch((err) => {
			console.log(`ERROR: ${err}`);
		});

	// EXAMPLE 2: Save in various formats - JSZip offers: ['arraybuffer', 'base64', 'binarystring', 'blob', 'nodebuffer', 'uint8array']
	// pptx.write("base64")
	// 	.catch((err) => {
	// 		throw new Error(err);
	// 	})
	// 	.then((data) => {
	// 		console.log(`BASE64 TEST: First 100 chars of 'data':\n`);
	// 		console.log(data.substring(0, 99));
	// 	})
	// 	.catch((err) => {
	// 		console.log(`ERROR: ${err}`);
	// 	});

	// **NOTE** If you continue to use the `pptx` variable, new Slides will be added to the existing set
}

// ============================================================================

console.log(`\n--------------------==~==~==~==[ ...DEMO COMPLETE ]==~==~==~==--------------------\n\n`);
