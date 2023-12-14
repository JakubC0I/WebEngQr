package de.hszg.pdfeditor.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.hszg.pdfeditor.data.Csv;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CsvService {
    ObjectMapper objectMapper;
    QrService qrService;


    public Csv parseCsv(String csv) {
        return new Csv(csv);
    }
//  TODO: Parse csv in frontend into JSON and send request for every row
    public void generateCodes(Csv csv) {
        HashMap<List<String>, String[]> data;
        for( String rowString : csv.getRows()) {
            qrService.createQrCode(rowString);
        }
    }


}
