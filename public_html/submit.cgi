#!/usr/bin/perl

use strict;
use warnings;

use CGI ':standard';
use Email::MIME;
use Email::Sender::Simple 'sendmail';

$CGI::LIST_CONTEXT_WARN = 0;

my $feedback = escapeHTML(CGI::param('feedback'));

my $message = Email::MIME->create();

$message->header_str_set(From => 'no-reply@krgamestudios.com');
$message->header_str_set(To => 'kayneruse@gmail.com');
$message->header_str_set(Subject => 'Mecha Feedback');

$message->encoding_set('quoted-printable');
$message->charset_set('UTF-8');

$message->body_set($feedback);

sendmail($message);

print "Content-type: text/html\n\n";
print "<p>Thank you for your feedback!!</p>";
