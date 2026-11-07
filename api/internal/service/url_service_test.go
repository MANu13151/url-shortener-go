package service

import (
	"crypto/sha256"
	"encoding/hex"
	"strings"
	"testing"

	"shortly-go/internal/model"
)

func TestRandomBase62(t *testing.T) {
	lengths := []int{5, 8, 16, 32, 64}

	for _, l := range lengths {
		token, err := randomBase62(l)
		if err != nil {
			t.Fatalf("unexpected error generating base62 string: %v", err)
		}
		if len(token) != l {
			t.Errorf("expected length %d, got %d", l, len(token))
		}
		for _, char := range token {
			if !strings.ContainsRune(base62Chars, char) {
				t.Errorf("token %q contains non-base62 character %c", token, char)
			}
		}
	}
}

func TestGenerateManageToken(t *testing.T) {
	plain, hash, err := generateManageToken()
	if err != nil {
		t.Fatalf("failed to generate manage token: %v", err)
	}

	if len(plain) != manageTokenLength {
		t.Errorf("expected plain token length %d, got %d", manageTokenLength, len(plain))
	}

	expectedSum := sha256.Sum256([]byte(plain))
	expectedHash := hex.EncodeToString(expectedSum[:])
	if hash != expectedHash {
		t.Errorf("expected hash %q, got %q", expectedHash, hash)
	}
}

func TestSlugPattern(t *testing.T) {
	validSlugs := []string{
		"my-slug",
		"github123",
		"short-link-2026",
		"abcde",
	}

	for _, s := range validSlugs {
		if !slugPattern.MatchString(s) {
			t.Errorf("expected slug %q to be valid", s)
		}
	}

	invalidSlugs := []string{
		"sh",        // too short (< 5)
		"a@bc",      // special character @
		"slug with space",
		"slug_underscore",
		strings.Repeat("a", 51), // too long (> 50)
	}

	for _, s := range invalidSlugs {
		if slugPattern.MatchString(s) {
			t.Errorf("expected slug %q to be invalid", s)
		}
	}
}

func TestValidTTLs(t *testing.T) {
	ttls := []model.TTL{
		model.TTL1Hour,
		model.TTL1Day,
		model.TTL1Week,
		model.TTL1Month,
		model.TTL1Year,
	}

	for _, ttl := range ttls {
		dur, ok := model.ValidTTLs[ttl]
		if !ok || dur <= 0 {
			t.Errorf("expected TTL %q to be configured and positive", ttl)
		}
	}
}
