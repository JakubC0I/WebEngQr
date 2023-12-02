package de.hszg.pdfeditor.controller;

import de.hszg.pdfeditor.service.ImageService;
import de.hszg.pdfeditor.service.QrService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.imageio.ImageIO;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.util.Optional;

@Controller
public class GenerateController {
    @Autowired
    ImageService imageService;
    @Autowired
    QrService qrService;
//        TODO: add config
    private final File path = new File("/Users/jakubciszak/Studium/web-eng-project/pdfEditor/src/main/resources/ticket-modified.png");
    private final File fileQr = new File("/Users/jakubciszak/Studium/web-eng-project/pdfEditor/src/main/resources/qr.png");
    private final File sourcePng = new File("/Users/jakubciszak/Studium/web-eng-project/pdfEditor/src/main/resources/test-ticket.png");

    private final File fileSvg = new File("/Users/jakubciszak/Studium/web-eng-project/pdfEditor/src/main/resources/ticket.svg");


    @PostMapping(value = {"/qr/{enlargement}", "/qr"}, produces = "image/png")
    public ResponseEntity<byte[]> generateQr(@RequestBody String ticketJson, @PathVariable(required = false) Optional<Integer> enlargement) {
        ByteArrayOutputStream outImg = imageService.generateQrPng(qrService.createQrCode(ticketJson), enlargement.orElse(0));
//        imageService.generateQrSVG(qrService.createSvgQrCode(ticketJson, enlargement.orElse(100)));
        return ResponseEntity
                .status(200)
                .body(outImg.toByteArray());
    }

    @GetMapping("/merge")
    public ResponseEntity mergeImageWithQr(@RequestParam int x, @RequestParam int y) throws IOException {
//        TODO: save qrs with name of the user


        imageService.addQrToImage(ImageIO.read(fileQr), sourcePng, path, x, y);

        return ResponseEntity.ok("{\"message\": \"Images merged\"}");
    }

//    PdfDocument pdfDocument = pdfService.createPdfDocument(path);
//            pdfDocument.addNewPage(1);
//    PdfCanvas pdfCanvas = new PdfCanvas(pdfDocument, 1);
//
//    Rectangle rectangle = pdfService.addQrCodeToPdfCanvas(qrService.createQrCode(ticketJson), pdfCanvas);
//            System.out.println("HEIGHT: " + rectangle.getHeight() + "\nWIDTH: " + rectangle.getWidth());
//            pdfDocument.close();



}
