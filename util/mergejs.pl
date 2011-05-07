#!/bin/perl

use strict;

my $htm = "../s.htm";
my $path = "../";
my $fout = "GeJsMerge.js";

my $ls = '-'x80 . "\n";

print $ls;
print " Merging javascript sources\n";
print $ls;

my $fh;
open($fh, $htm) 
	or die "Cannot open file $htm";
my $out = "";
while(<$fh>) {
	/^\s*<script\s*src="\s*(.*)\s*"\s*>/ and do {
		my $js = $1;
		$js !~ /^(src).*/ and next;
		my $fh2;
		print "Appending $js\n";
		open($fh2, "$path$js") 
			or die "Cannot open javascript file: '$js'";
		$out .= "\n\/\/ Source: $js\n\n";
		while(<$fh2>) {
			$out .= $_;
		}
		$out .= "\n";
		next;
	}
}
my $fh;
open($fh, ">$path$fout")
	or die "Cannot open out file '$path$fout'";
print $fh $out;
print "\n";
print "Javascript files merged\n";
print $ls;