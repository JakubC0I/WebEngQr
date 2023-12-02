package de.hszg.pdfeditor.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.itextpdf.barcodes.BarcodeDataMatrix;
import com.itextpdf.barcodes.BarcodeQRCode;
import com.itextpdf.barcodes.qrcode.ByteMatrix;
import de.hszg.pdfeditor.data.Ticket;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
public class QrService {
    @Autowired
    KeyGeneratorService keyGeneratorService;
    @Autowired
    ObjectMapper objectMapper;
    QRCodeWriter qrCodeWriter = new QRCodeWriter();


    public BarcodeQRCode createQrCode(String ticketJson) {
        return new BarcodeQRCode(encryptTicket(ticketJson));
    }

    public BitMatrix createSvgQrCode(String ticketJson, int size) throws WriterException {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        return qrCodeWriter.encode(encryptTicket(ticketJson), BarcodeFormat.QR_CODE, size, size);
    }

    public String encryptTicket(String ticketJson) {
        try {
            return keyGeneratorService.encrypt(ticketJson);
        } catch (NoSuchPaddingException e) {
            throw new RuntimeException(e);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        } catch (InvalidAlgorithmParameterException e) {
            throw new RuntimeException(e);
        } catch (InvalidKeyException e) {
            throw new RuntimeException(e);
        } catch (BadPaddingException e) {
            throw new RuntimeException(e);
        } catch (IllegalBlockSizeException e) {
            throw new RuntimeException(e);
        }
    }

    public Ticket decryptTicket(String ticket) {
        try {
            String ticketString = keyGeneratorService.decrypt(ticket);
            return objectMapper.readValue(ticketString, Ticket.class);
        } catch (NoSuchPaddingException e) {
            throw new RuntimeException(e);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        } catch (InvalidAlgorithmParameterException e) {
            throw new RuntimeException(e);
        } catch (InvalidKeyException e) {
            throw new RuntimeException(e);
        } catch (BadPaddingException e) {
            throw new RuntimeException(e);
        } catch (IllegalBlockSizeException e) {
            throw new RuntimeException(e);
        } catch (JsonMappingException e) {
            throw new RuntimeException(e);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}


