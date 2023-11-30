package de.hszg.pdfeditor.data;

import lombok.Data;

import java.util.HashMap;

@Data
public class Ticket {
    String firstname;
    String lastname;
    String eventName;
    boolean encrypt;
    HashMap<String, String> additionalFields;
}
