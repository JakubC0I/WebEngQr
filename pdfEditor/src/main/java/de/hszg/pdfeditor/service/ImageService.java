package de.hszg.pdfeditor.service;

import com.google.zxing.common.BitMatrix;
import com.itextpdf.barcodes.BarcodeQRCode;
import com.itextpdf.barcodes.qrcode.ByteMatrix;
import com.itextpdf.kernel.colors.Color;
import com.itextpdf.kernel.geom.Rectangle;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.canvas.PdfCanvas;
import com.itextpdf.kernel.pdf.colorspace.PdfCieBasedCs;
import org.bouncycastle.util.Strings;
import org.jfree.svg.SVGGraphics2D;
import org.jfree.svg.SVGUtils;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;

@Service
public class ImageService {

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


    public void generateQrSVG(BitMatrix bitMatrix, ByteArrayOutputStream byteOut) throws IOException {
        int matrixWidth = bitMatrix.getWidth();
        int matrixHeight = bitMatrix.getHeight();
        SVGGraphics2D g2 = new SVGGraphics2D(matrixWidth, matrixWidth);
        g2.setColor(java.awt.Color.BLACK);
        for (int i = 0; i < matrixWidth; i++) {
            for (int j = 0; j < matrixHeight; j++) {
                if (bitMatrix.get(i, j)) {
                    g2.fillRect(i, j, 1, 1);
                }
            }
        }
        String svgElement = g2.getSVGElement();

        byteOut.write(Strings.toByteArray(svgElement));
    }
}
