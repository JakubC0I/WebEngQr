package de.hszg.pdfeditor.service;

import com.itextpdf.barcodes.BarcodeQRCode;
import com.itextpdf.io.image.ImageType;
import com.itextpdf.io.image.JpegImageData;
import com.itextpdf.kernel.colors.Color;
import com.itextpdf.kernel.geom.Rectangle;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.canvas.PdfCanvas;
import com.itextpdf.kernel.pdf.colorspace.PdfCieBasedCs;
import com.itextpdf.kernel.pdf.xobject.PdfXObject;
import org.jfree.svg.SVGGraphics2D;
import org.jfree.svg.SVGGraphicsDevice;
import org.jfree.svg.SVGUtils;
import org.springframework.stereotype.Service;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.awt.image.ImageObserver;
import java.awt.image.RenderedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;

@Service
public class PdfService {

    public PdfDocument createPdfDocument(String path) {
        PdfWriter pdfWriter;
        try {
            pdfWriter = new PdfWriter(path);
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }
        PdfDocument pdfDocument = new PdfDocument(pdfWriter);
        return pdfDocument;
    }

    public ByteArrayOutputStream generateQrPng(BarcodeQRCode qr, int enlarge) {
        ByteArrayOutputStream byteOut = new ByteArrayOutputStream();
        Image awtImage = qr.createAwtImage(java.awt.Color.BLACK, java.awt.Color.WHITE);
        if (enlarge != 0) {
            awtImage = awtImage.getScaledInstance(enlarge, enlarge, Image.SCALE_DEFAULT);
        }

        BufferedImage bi = new BufferedImage(
                awtImage.getWidth(null),
                awtImage.getHeight(null),
                BufferedImage.TYPE_BYTE_GRAY);
        Graphics g = bi.getGraphics();
        try {
            g.drawImage(awtImage, 0, 0, null);
            ImageIO.write(bi, "png", byteOut);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return byteOut;
    }

    public Rectangle addQrCodeToPdfCanvas(BarcodeQRCode qr, PdfCanvas canvas) {
        PdfCieBasedCs pdfColor = new PdfCieBasedCs.CalGray(new float[]{255, 255, 255});
        return qr.placeBarcode(canvas, Color.makeColor(pdfColor));
    }

    public void addQrToImage(BufferedImage qrCode, File sourceFile, File destination, int posx, int posy){
        try {
            BufferedImage read = ImageIO.read(sourceFile);
            BufferedImage bi = new BufferedImage(read.getWidth(), read.getHeight(), BufferedImage.TYPE_3BYTE_BGR);

            Graphics biGraphics = bi.getGraphics();
            biGraphics.drawImage(read,0,0,null);
            biGraphics.drawImage(qrCode, posx, posy ,null);

            ImageIO.write(bi, "png", destination);
            biGraphics.dispose();

        } catch (IOException e) {
            throw new RuntimeException(e);
        }


    }














}
