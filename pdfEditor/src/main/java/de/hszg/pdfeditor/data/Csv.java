package de.hszg.pdfeditor.data;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Data
public class Csv {
    @JsonIgnore
    List<String> fieldNames;
    @JsonIgnore
    List<List<String>> cells;
    String[] rows;

    public Csv(String data) {
        rows = data.split("\n");
        if (rows.length > 1) {
            for ( String cell : rows[0].split(",")) {
                fieldNames.add(cell.trim());
            }
        }
    }

//    public Csv(String data) {
//        List<String> row = new ArrayList<>();
//        for (String element : data.split(",")) {
//            if (element.contains("\n")) {
//                row.add(element.substring(element.length() - 1));
//                cells.add(row);
//                row = new ArrayList<>();
//            }
//            if (element.contains(" ")) {
//                element = element.trim();
//            }
//            row.add(element);
//        }
//        fieldNames = cells.get(0);
//    }
}
