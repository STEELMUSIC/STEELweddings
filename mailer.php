<?php
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // 1. HONEYPOT CHECK (Spam-Schutz)
    if (!empty($_POST["honeypot"])) {
        http_response_code(200); 
        exit;
    }

    // 2. BASIS-DATEN
    $source = strip_tags(trim($_POST["source"] ?? 'Allgemeine')); // Wird zu "Hochzeits", "Live" oder "Corporate"
    $recipient = "info@steelmusic.net"; 
    $sender = "website@steelmusic.net"; // Muss bei Strato existieren!
    
    $reply_to = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : $sender;

    // 3. DATUM FÜR DEN BETREFF FORMATIEREN
    $raw_date = $_POST['date'] ?? '';
    if (!empty($raw_date)) {
        // Macht aus 2026-08-15 ein 15.08.2026
        $event_datum = date('d.m.Y', strtotime($raw_date));
    } else {
        $event_datum = 'unbekanntem Datum';
    }

    // Dein dynamischer Wunsch-Betreff!
    $subject = "{$source}-Anfrage für STEEL am $event_datum";

    // 4. E-MAIL INHALT ZUSAMMENBAUEN
    $email_content = "Du hast eine neue Kontaktanfrage erhalten:\n";
    $email_content .= "--------------------------------------------------\n\n";

    foreach ($_POST as $key => $value) {
        if ($key === 'honeypot' || $key === 'source') continue;

        $clean_key = ucwords(str_replace(array('_', '-'), ' ', strip_tags($key)));
        $clean_value = strip_tags(trim($value));

        if (!empty($clean_value)) {
            $email_content .= "$clean_key:\n$clean_value\n\n";
        }
    }

    // 5. ABSENDEN
    $headers = "From: Website <$sender>\r\n";
    $headers .= "Reply-To: $reply_to\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    if (mail($recipient, $subject, $email_content, $headers)) {
        http_response_code(200);
        echo json_encode(["status" => "success"]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Fehler beim Senden."]);
    }
} else {
    http_response_code(403);
    echo json_encode(["status" => "error"]);
}
?>