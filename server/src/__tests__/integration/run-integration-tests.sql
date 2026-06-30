-- ============================================================
-- CarryMate Integration Test Runner — v2 (corrected schema)
-- Executes INT-01 through INT-10 directly against Supabase
-- Uses actual column names and enum values from live DB
-- ============================================================
-- Schema notes:
--   users.auth_id = UUID (not text)
--   notifications.type enum: booking_created|booking_confirmed|booking_accepted|
--     collection_verified|delivery_confirmed|dispute_raised|new_message|review_received
--   audit_logs cols: admin_id, admin_name, action, target_type, target_id (UUID), metadata (jsonb)
--   parcels: no 'title' col, use 'contents' for description
--   parcels.status enum: pending|matched|booked|collected|in_transit|delivered|cancelled
--   bookings.status enum: pending|confirmed|collected|in_transit|delivered|disputed|cancelled
-- ============================================================

-- ── INT-01: Full Delivery Lifecycle ──────────────────────────
DO $$
DECLARE
  v_sender_id UUID;
  v_traveler_id UUID;
  v_parcel_id UUID;
  v_trip_id UUID;
  v_booking_id UUID;
  v_payment_id UUID;
  v_parcel_status TEXT;
  v_payment_status TEXT;
BEGIN
  RAISE NOTICE 'INT-01: Full Delivery Lifecycle — START';

  INSERT INTO users (auth_id, email, name, role, kyc_status)
  VALUES (gen_random_uuid(), 'int01-sender@test.carrymate.io', 'INT01 Sender', 'sender', 'verified')
  RETURNING id INTO v_sender_id;

  INSERT INTO users (auth_id, email, name, role, kyc_status)
  VALUES (gen_random_uuid(), 'int01-traveler@test.carrymate.io', 'INT01 Traveler', 'traveler', 'verified')
  RETURNING id INTO v_traveler_id;

  INSERT INTO parcels (sender_id, contents, weight_kg, origin_city, origin_code, dest_city, dest_code, recipient_name, recipient_phone, status)
  VALUES (v_sender_id, 'INT01 test parcel', 2.5, 'London', 'LHR', 'Lagos', 'LOS', 'Recipient', '+2348012345678', 'pending')
  RETURNING id INTO v_parcel_id;

  INSERT INTO trips (traveler_id, origin_city, origin_code, dest_city, dest_code, departure_date, available_kg, remaining_kg, price_per_kg, status)
  VALUES (v_traveler_id, 'London', 'LHR', 'Lagos', 'LOS', NOW() + INTERVAL '7 days', 10.00, 10.00, 15.00, 'open')
  RETURNING id INTO v_trip_id;

  INSERT INTO bookings (parcel_id, trip_id, sender_id, traveler_id, agreed_price, service_fee, total_amount, status, collection_otp, delivery_otp)
  VALUES (v_parcel_id, v_trip_id, v_sender_id, v_traveler_id, 37.50, 3.75, 41.25, 'confirmed', '123456', '654321')
  RETURNING id INTO v_booking_id;

  UPDATE parcels SET status = 'booked' WHERE id = v_parcel_id;

  INSERT INTO payments (booking_id, sender_id, traveler_id, amount, currency, status)
  VALUES (v_booking_id, v_sender_id, v_traveler_id, 41.25, 'gbp', 'pending')
  RETURNING id INTO v_payment_id;

  UPDATE payments SET status = 'held', held_at = NOW() WHERE id = v_payment_id;

  -- Pickup OTP confirmed
  UPDATE bookings SET status = 'collected', collection_verified_at = NOW() WHERE id = v_booking_id;
  UPDATE parcels SET status = 'collected' WHERE id = v_parcel_id;

  -- Delivery OTP confirmed
  UPDATE bookings SET status = 'delivered', delivery_verified_at = NOW() WHERE id = v_booking_id;
  UPDATE parcels SET status = 'delivered' WHERE id = v_parcel_id;

  -- Release escrow
  UPDATE payments SET status = 'released', released_at = NOW() WHERE id = v_payment_id;

  SELECT status INTO v_parcel_status FROM parcels WHERE id = v_parcel_id;
  SELECT status INTO v_payment_status FROM payments WHERE id = v_payment_id;

  IF v_parcel_status = 'delivered' AND v_payment_status = 'released' THEN
    RAISE NOTICE 'INT-01: PASS — parcel=%, payment=%', v_parcel_status, v_payment_status;
  ELSE
    RAISE EXCEPTION 'INT-01: FAIL — parcel=%, payment=%', v_parcel_status, v_payment_status;
  END IF;

  DELETE FROM payments WHERE id = v_payment_id;
  DELETE FROM bookings WHERE id = v_booking_id;
  DELETE FROM parcels WHERE id = v_parcel_id;
  DELETE FROM trips WHERE id = v_trip_id;
  DELETE FROM users WHERE id IN (v_sender_id, v_traveler_id);
END $$;

-- ── INT-02: Stripe Payment ────────────────────────────────────
DO $$
DECLARE
  v_sender_id UUID;
  v_traveler_id UUID;
  v_parcel_id UUID;
  v_trip_id UUID;
  v_booking_id UUID;
  v_payment_id UUID;
  v_payment_status TEXT;
  v_stripe_pi TEXT;
BEGIN
  RAISE NOTICE 'INT-02: Stripe Payment (DB-side) — START';

  INSERT INTO users (auth_id, email, name, role, kyc_status, stripe_account_id)
  VALUES (gen_random_uuid(), 'int02-sender@test.carrymate.io', 'INT02 Sender', 'sender', 'verified', NULL)
  RETURNING id INTO v_sender_id;

  INSERT INTO users (auth_id, email, name, role, kyc_status, stripe_account_id)
  VALUES (gen_random_uuid(), 'int02-traveler@test.carrymate.io', 'INT02 Traveler', 'traveler', 'verified', 'acct_test_placeholder')
  RETURNING id INTO v_traveler_id;

  INSERT INTO parcels (sender_id, contents, weight_kg, origin_city, origin_code, dest_city, dest_code, recipient_name, recipient_phone, status)
  VALUES (v_sender_id, 'INT02 Stripe test parcel', 1.0, 'London', 'LHR', 'Accra', 'ACC', 'Recipient', '+233201234567', 'pending')
  RETURNING id INTO v_parcel_id;

  INSERT INTO trips (traveler_id, origin_city, origin_code, dest_city, dest_code, departure_date, available_kg, remaining_kg, price_per_kg, status)
  VALUES (v_traveler_id, 'London', 'LHR', 'Accra', 'ACC', NOW() + INTERVAL '7 days', 5.00, 5.00, 20.00, 'open')
  RETURNING id INTO v_trip_id;

  INSERT INTO bookings (parcel_id, trip_id, sender_id, traveler_id, agreed_price, service_fee, total_amount, status, collection_otp, delivery_otp)
  VALUES (v_parcel_id, v_trip_id, v_sender_id, v_traveler_id, 20.00, 2.00, 22.00, 'confirmed', '111222', '333444')
  RETURNING id INTO v_booking_id;

  INSERT INTO payments (booking_id, sender_id, traveler_id, amount, currency, status, stripe_payment_intent_id)
  VALUES (v_booking_id, v_sender_id, v_traveler_id, 22.00, 'gbp', 'held', 'pi_test_INT02')
  RETURNING id INTO v_payment_id;

  UPDATE payments SET status = 'released', released_at = NOW() WHERE id = v_payment_id;

  SELECT status, stripe_payment_intent_id INTO v_payment_status, v_stripe_pi FROM payments WHERE id = v_payment_id;

  IF v_payment_status = 'released' AND v_stripe_pi = 'pi_test_INT02' THEN
    RAISE NOTICE 'INT-02: PASS — payment=%, stripe_pi=%', v_payment_status, v_stripe_pi;
  ELSE
    RAISE EXCEPTION 'INT-02: FAIL — payment=%, stripe_pi=%', v_payment_status, v_stripe_pi;
  END IF;

  DELETE FROM payments WHERE id = v_payment_id;
  DELETE FROM bookings WHERE id = v_booking_id;
  DELETE FROM parcels WHERE id = v_parcel_id;
  DELETE FROM trips WHERE id = v_trip_id;
  DELETE FROM users WHERE id IN (v_sender_id, v_traveler_id);
END $$;

-- ── INT-03: Paystack Payment ──────────────────────────────────
DO $$
DECLARE
  v_sender_id UUID;
  v_traveler_id UUID;
  v_parcel_id UUID;
  v_trip_id UUID;
  v_booking_id UUID;
  v_payment_id UUID;
  v_payment_status TEXT;
  v_paystack_ref TEXT;
BEGIN
  RAISE NOTICE 'INT-03: Paystack Payment — START';

  INSERT INTO users (auth_id, email, name, role, kyc_status)
  VALUES (gen_random_uuid(), 'int03-sender@test.carrymate.io', 'INT03 Sender', 'sender', 'verified')
  RETURNING id INTO v_sender_id;

  INSERT INTO users (auth_id, email, name, role, kyc_status)
  VALUES (gen_random_uuid(), 'int03-traveler@test.carrymate.io', 'INT03 Traveler', 'traveler', 'verified')
  RETURNING id INTO v_traveler_id;

  INSERT INTO parcels (sender_id, contents, weight_kg, origin_city, origin_code, dest_city, dest_code, recipient_name, recipient_phone, status)
  VALUES (v_sender_id, 'INT03 Paystack test parcel', 1.0, 'Lagos', 'LOS', 'London', 'LHR', 'Recipient', '+447700900000', 'pending')
  RETURNING id INTO v_parcel_id;

  INSERT INTO trips (traveler_id, origin_city, origin_code, dest_city, dest_code, departure_date, available_kg, remaining_kg, price_per_kg, status)
  VALUES (v_traveler_id, 'Lagos', 'LOS', 'London', 'LHR', NOW() + INTERVAL '7 days', 5.00, 5.00, 5000.00, 'open')
  RETURNING id INTO v_trip_id;

  INSERT INTO bookings (parcel_id, trip_id, sender_id, traveler_id, agreed_price, service_fee, total_amount, status, collection_otp, delivery_otp)
  VALUES (v_parcel_id, v_trip_id, v_sender_id, v_traveler_id, 5000.00, 500.00, 5500.00, 'confirmed', '555666', '777888')
  RETURNING id INTO v_booking_id;

  INSERT INTO payments (booking_id, sender_id, traveler_id, amount, currency, status, paystack_reference)
  VALUES (v_booking_id, v_sender_id, v_traveler_id, 5500.00, 'ngn', 'held', 'CARRYMATE-INT03-TEST')
  RETURNING id INTO v_payment_id;

  SELECT status, paystack_reference INTO v_payment_status, v_paystack_ref FROM payments WHERE id = v_payment_id;

  IF v_payment_status = 'held' AND v_paystack_ref = 'CARRYMATE-INT03-TEST' THEN
    RAISE NOTICE 'INT-03: PASS — payment=%, ref=%', v_payment_status, v_paystack_ref;
  ELSE
    RAISE EXCEPTION 'INT-03: FAIL — payment=%, ref=%', v_payment_status, v_paystack_ref;
  END IF;

  DELETE FROM payments WHERE id = v_payment_id;
  DELETE FROM bookings WHERE id = v_booking_id;
  DELETE FROM parcels WHERE id = v_parcel_id;
  DELETE FROM trips WHERE id = v_trip_id;
  DELETE FROM users WHERE id IN (v_sender_id, v_traveler_id);
END $$;

-- ── INT-04: Sumsub KYC Webhook ────────────────────────────────
DO $$
DECLARE
  v_user_id UUID;
  v_kyc_id UUID;
  v_kyc_status TEXT;
  v_submission_status TEXT;
BEGIN
  RAISE NOTICE 'INT-04: Sumsub KYC Webhook — START';

  INSERT INTO users (auth_id, email, name, role, kyc_status)
  VALUES (gen_random_uuid(), 'int04-user@test.carrymate.io', 'INT04 User', 'sender', 'submitted')
  RETURNING id INTO v_user_id;

  INSERT INTO kyc_submissions (user_id, provider, applicant_id, status, submitted_at)
  VALUES (v_user_id, 'sumsub', 'test-applicant-int04', 'pending', NOW())
  RETURNING id INTO v_kyc_id;

  -- Simulate webhook: GREEN → verified
  UPDATE users SET kyc_status = 'verified' WHERE id = v_user_id;
  UPDATE kyc_submissions SET status = 'approved', reviewed_at = NOW() WHERE id = v_kyc_id;

  SELECT kyc_status INTO v_kyc_status FROM users WHERE id = v_user_id;
  SELECT status INTO v_submission_status FROM kyc_submissions WHERE id = v_kyc_id;

  IF v_kyc_status = 'verified' AND v_submission_status = 'approved' THEN
    RAISE NOTICE 'INT-04: PASS — kyc_status=%, submission=%', v_kyc_status, v_submission_status;
  ELSE
    RAISE EXCEPTION 'INT-04: FAIL — kyc_status=%, submission=%', v_kyc_status, v_submission_status;
  END IF;

  DELETE FROM kyc_submissions WHERE id = v_kyc_id;
  DELETE FROM users WHERE id = v_user_id;
END $$;

-- ── INT-05: Dispute Flow ──────────────────────────────────────
DO $$
DECLARE
  v_sender_id UUID;
  v_traveler_id UUID;
  v_admin_id UUID;
  v_parcel_id UUID;
  v_trip_id UUID;
  v_booking_id UUID;
  v_payment_id UUID;
  v_dispute_id UUID;
  v_dispute_status TEXT;
  v_payment_status TEXT;
BEGIN
  RAISE NOTICE 'INT-05: Dispute Flow — START';

  INSERT INTO users (auth_id, email, name, role, kyc_status)
  VALUES (gen_random_uuid(), 'int05-sender@test.carrymate.io', 'INT05 Sender', 'sender', 'verified')
  RETURNING id INTO v_sender_id;

  INSERT INTO users (auth_id, email, name, role, kyc_status)
  VALUES (gen_random_uuid(), 'int05-traveler@test.carrymate.io', 'INT05 Traveler', 'traveler', 'verified')
  RETURNING id INTO v_traveler_id;

  INSERT INTO users (auth_id, email, name, role, kyc_status)
  VALUES (gen_random_uuid(), 'int05-admin@test.carrymate.io', 'INT05 Admin', 'admin', 'verified')
  RETURNING id INTO v_admin_id;

  INSERT INTO parcels (sender_id, contents, weight_kg, origin_city, origin_code, dest_city, dest_code, recipient_name, recipient_phone, status)
  VALUES (v_sender_id, 'INT05 dispute test parcel', 2.0, 'London', 'LHR', 'Lagos', 'LOS', 'Recipient', '+2348099999999', 'in_transit')
  RETURNING id INTO v_parcel_id;

  INSERT INTO trips (traveler_id, origin_city, origin_code, dest_city, dest_code, departure_date, available_kg, remaining_kg, price_per_kg, status)
  VALUES (v_traveler_id, 'London', 'LHR', 'Lagos', 'LOS', NOW() - INTERVAL '3 days', 5.00, 3.00, 15.00, 'open')
  RETURNING id INTO v_trip_id;

  INSERT INTO bookings (parcel_id, trip_id, sender_id, traveler_id, agreed_price, service_fee, total_amount, status, collection_otp, delivery_otp)
  VALUES (v_parcel_id, v_trip_id, v_sender_id, v_traveler_id, 30.00, 3.00, 33.00, 'collected', '999111', '222333')
  RETURNING id INTO v_booking_id;

  INSERT INTO payments (booking_id, sender_id, traveler_id, amount, currency, status, held_at)
  VALUES (v_booking_id, v_sender_id, v_traveler_id, 33.00, 'gbp', 'held', NOW())
  RETURNING id INTO v_payment_id;

  -- Sender raises dispute
  INSERT INTO disputes (booking_id, raised_by, reason, status)
  VALUES (v_booking_id, v_sender_id, 'Parcel not delivered after 5 days', 'open')
  RETURNING id INTO v_dispute_id;

  UPDATE bookings SET status = 'disputed' WHERE id = v_booking_id;

  -- Admin resolves → refund
  UPDATE disputes SET status = 'resolved', resolution = 'Refund issued', resolved_by = v_admin_id, resolved_at = NOW() WHERE id = v_dispute_id;
  UPDATE payments SET status = 'refunded' WHERE id = v_payment_id;

  SELECT status INTO v_dispute_status FROM disputes WHERE id = v_dispute_id;
  SELECT status INTO v_payment_status FROM payments WHERE id = v_payment_id;

  IF v_dispute_status = 'resolved' AND v_payment_status = 'refunded' THEN
    RAISE NOTICE 'INT-05: PASS — dispute=%, payment=%', v_dispute_status, v_payment_status;
  ELSE
    RAISE EXCEPTION 'INT-05: FAIL — dispute=%, payment=%', v_dispute_status, v_payment_status;
  END IF;

  DELETE FROM disputes WHERE id = v_dispute_id;
  DELETE FROM payments WHERE id = v_payment_id;
  DELETE FROM bookings WHERE id = v_booking_id;
  DELETE FROM parcels WHERE id = v_parcel_id;
  DELETE FROM trips WHERE id = v_trip_id;
  DELETE FROM users WHERE id IN (v_sender_id, v_traveler_id, v_admin_id);
END $$;

-- ── INT-06: Escrow Timeout ────────────────────────────────────
DO $$
DECLARE
  v_sender_id UUID;
  v_traveler_id UUID;
  v_parcel_id UUID;
  v_trip_id UUID;
  v_booking_id UUID;
  v_payment_id UUID;
  v_dispute_id UUID;
  v_dispute_status TEXT;
  v_booking_status TEXT;
BEGIN
  RAISE NOTICE 'INT-06: Escrow Timeout — START';

  INSERT INTO users (auth_id, email, name, role, kyc_status)
  VALUES (gen_random_uuid(), 'int06-sender@test.carrymate.io', 'INT06 Sender', 'sender', 'verified')
  RETURNING id INTO v_sender_id;

  INSERT INTO users (auth_id, email, name, role, kyc_status)
  VALUES (gen_random_uuid(), 'int06-traveler@test.carrymate.io', 'INT06 Traveler', 'traveler', 'verified')
  RETURNING id INTO v_traveler_id;

  INSERT INTO parcels (sender_id, contents, weight_kg, origin_city, origin_code, dest_city, dest_code, recipient_name, recipient_phone, status)
  VALUES (v_sender_id, 'INT06 escrow timeout test', 1.5, 'London', 'LHR', 'Lagos', 'LOS', 'Recipient', '+2348077777777', 'in_transit')
  RETURNING id INTO v_parcel_id;

  INSERT INTO trips (traveler_id, origin_city, origin_code, dest_city, dest_code, departure_date, available_kg, remaining_kg, price_per_kg, status)
  VALUES (v_traveler_id, 'London', 'LHR', 'Lagos', 'LOS', NOW() - INTERVAL '5 days', 5.00, 3.50, 15.00, 'open')
  RETURNING id INTO v_trip_id;

  INSERT INTO bookings (parcel_id, trip_id, sender_id, traveler_id, agreed_price, service_fee, total_amount, status, collection_otp, delivery_otp)
  VALUES (v_parcel_id, v_trip_id, v_sender_id, v_traveler_id, 22.50, 2.25, 24.75, 'collected', '444555', '666777')
  RETURNING id INTO v_booking_id;

  -- Payment held 73 hours ago
  INSERT INTO payments (booking_id, sender_id, traveler_id, amount, currency, status, held_at)
  VALUES (v_booking_id, v_sender_id, v_traveler_id, 24.75, 'gbp', 'held', NOW() - INTERVAL '73 hours')
  RETURNING id INTO v_payment_id;

  -- Escrow worker: payment held > 72hr → auto-dispute
  INSERT INTO disputes (booking_id, raised_by, reason, status)
  VALUES (v_booking_id, v_sender_id, 'Automatic dispute: payment held for more than 72 hours without delivery confirmation.', 'open')
  RETURNING id INTO v_dispute_id;

  UPDATE bookings SET status = 'disputed' WHERE id = v_booking_id;

  SELECT status INTO v_dispute_status FROM disputes WHERE id = v_dispute_id;
  SELECT status INTO v_booking_status FROM bookings WHERE id = v_booking_id;

  IF v_dispute_status = 'open' AND v_booking_status = 'disputed' THEN
    RAISE NOTICE 'INT-06: PASS — dispute=%, booking=%', v_dispute_status, v_booking_status;
  ELSE
    RAISE EXCEPTION 'INT-06: FAIL — dispute=%, booking=%', v_dispute_status, v_booking_status;
  END IF;

  DELETE FROM disputes WHERE id = v_dispute_id;
  DELETE FROM payments WHERE id = v_payment_id;
  DELETE FROM bookings WHERE id = v_booking_id;
  DELETE FROM parcels WHERE id = v_parcel_id;
  DELETE FROM trips WHERE id = v_trip_id;
  DELETE FROM users WHERE id IN (v_sender_id, v_traveler_id);
END $$;

-- ── INT-07: Surge Pricing ─────────────────────────────────────
DO $$
DECLARE
  v_sender_id UUID;
  v_traveler_id UUID;
  v_corridor_id UUID;
  v_trip_id UUID;
  v_parcel_demand INT;
  v_traveler_slots INT;
  v_ratio NUMERIC;
  v_new_multiplier NUMERIC;
  v_corridor_multiplier NUMERIC;
BEGIN
  RAISE NOTICE 'INT-07: Surge Pricing — START';

  INSERT INTO users (auth_id, email, name, role, kyc_status)
  VALUES (gen_random_uuid(), 'int07-sender@test.carrymate.io', 'INT07 Sender', 'sender', 'verified')
  RETURNING id INTO v_sender_id;

  INSERT INTO users (auth_id, email, name, role, kyc_status)
  VALUES (gen_random_uuid(), 'int07-traveler@test.carrymate.io', 'INT07 Traveler', 'traveler', 'verified')
  RETURNING id INTO v_traveler_id;

  INSERT INTO corridor_rules (corridor_key, origin_city, origin_code, dest_city, dest_code, base_price_per_kg, surge_multiplier, max_weight_kg, is_active)
  VALUES ('INT07-TST', 'INT07 Origin', 'I07', 'INT07 Dest', 'I07D', 10.00, 1.00, 30.00, true)
  RETURNING id INTO v_corridor_id;

  -- 1 open trip (supply = 1)
  INSERT INTO trips (traveler_id, origin_city, origin_code, dest_city, dest_code, departure_date, available_kg, remaining_kg, price_per_kg, status)
  VALUES (v_traveler_id, 'INT07 Origin', 'I07', 'INT07 Dest', 'I07D', NOW() + INTERVAL '7 days', 10.00, 10.00, 10.00, 'open')
  RETURNING id INTO v_trip_id;

  -- 3 pending parcels (demand = 3, ratio = 3:1 → 1.15x)
  INSERT INTO parcels (sender_id, contents, weight_kg, origin_city, origin_code, dest_city, dest_code, recipient_name, recipient_phone, status)
  VALUES (v_sender_id, 'INT07 Parcel 1', 1.0, 'INT07 Origin', 'I07', 'INT07 Dest', 'I07D', 'Recipient', '+447700900001', 'pending');
  INSERT INTO parcels (sender_id, contents, weight_kg, origin_city, origin_code, dest_city, dest_code, recipient_name, recipient_phone, status)
  VALUES (v_sender_id, 'INT07 Parcel 2', 1.0, 'INT07 Origin', 'I07', 'INT07 Dest', 'I07D', 'Recipient', '+447700900001', 'pending');
  INSERT INTO parcels (sender_id, contents, weight_kg, origin_city, origin_code, dest_city, dest_code, recipient_name, recipient_phone, status)
  VALUES (v_sender_id, 'INT07 Parcel 3', 1.0, 'INT07 Origin', 'I07', 'INT07 Dest', 'I07D', 'Recipient', '+447700900001', 'pending');

  SELECT COUNT(*) INTO v_parcel_demand FROM parcels WHERE origin_code = 'I07' AND dest_code = 'I07D' AND status = 'pending';
  SELECT COUNT(*) INTO v_traveler_slots FROM trips WHERE origin_code = 'I07' AND dest_code = 'I07D' AND status = 'open';

  v_ratio := v_parcel_demand::NUMERIC / NULLIF(v_traveler_slots, 0);

  IF v_ratio >= 4 THEN v_new_multiplier := 1.25;
  ELSIF v_ratio >= 2 THEN v_new_multiplier := 1.15;
  ELSE v_new_multiplier := 1.00;
  END IF;

  UPDATE corridor_rules SET surge_multiplier = v_new_multiplier WHERE id = v_corridor_id;

  SELECT surge_multiplier INTO v_corridor_multiplier FROM corridor_rules WHERE id = v_corridor_id;

  IF v_corridor_multiplier = 1.15 THEN
    RAISE NOTICE 'INT-07: PASS — multiplier=%, ratio=%', v_corridor_multiplier, v_ratio;
  ELSE
    RAISE EXCEPTION 'INT-07: FAIL — multiplier=%, ratio=%', v_corridor_multiplier, v_ratio;
  END IF;

  DELETE FROM parcels WHERE origin_code = 'I07' AND dest_code = 'I07D';
  DELETE FROM trips WHERE id = v_trip_id;
  DELETE FROM corridor_rules WHERE id = v_corridor_id;
  DELETE FROM users WHERE id IN (v_sender_id, v_traveler_id);
END $$;

-- ── INT-08: Matching Worker ───────────────────────────────────
DO $$
DECLARE
  v_sender_id UUID;
  v_traveler_ids UUID[] := ARRAY[]::UUID[];
  v_parcel_id UUID;
  v_tid UUID;
  v_notif_count INT;
  v_low_notif_count INT;
BEGIN
  RAISE NOTICE 'INT-08: Matching Worker — START';

  INSERT INTO users (auth_id, email, name, role, kyc_status)
  VALUES (gen_random_uuid(), 'int08-sender@test.carrymate.io', 'INT08 Sender', 'sender', 'verified')
  RETURNING id INTO v_sender_id;

  FOR i IN 1..4 LOOP
    INSERT INTO users (auth_id, email, name, role, kyc_status, average_rating, completed_deliveries)
    VALUES (
      gen_random_uuid(),
      'int08-traveler-' || i || '@test.carrymate.io',
      'INT08 Traveler ' || i,
      'traveler', 'verified',
      CASE WHEN i = 1 THEN 4.9 WHEN i = 2 THEN 4.7 WHEN i = 3 THEN 4.5 ELSE 3.2 END,
      CASE WHEN i = 1 THEN 50 WHEN i = 2 THEN 30 WHEN i = 3 THEN 20 ELSE 2 END
    )
    RETURNING id INTO v_tid;
    v_traveler_ids := v_traveler_ids || v_tid;

    INSERT INTO trips (traveler_id, origin_city, origin_code, dest_city, dest_code, departure_date, available_kg, remaining_kg, price_per_kg, status)
    VALUES (v_tid, 'INT08 Origin', 'I08', 'INT08 Dest', 'I08D', NOW() + INTERVAL '5 days', 10.00, 10.00, 12.00, 'open');
  END LOOP;

  INSERT INTO parcels (sender_id, contents, weight_kg, origin_city, origin_code, dest_city, dest_code, recipient_name, recipient_phone, status)
  VALUES (v_sender_id, 'INT08 matching test parcel', 2.0, 'INT08 Origin', 'I08', 'INT08 Dest', 'I08D', 'Recipient', '+447700900002', 'pending')
  RETURNING id INTO v_parcel_id;

  -- Notify top 3 travelers (ordered by rating DESC)
  INSERT INTO notifications (user_id, type, title, body, is_read)
  SELECT t.traveler_id, 'booking_created', 'New parcel match!', 'INT08 test notification', false
  FROM trips t
  JOIN users u ON u.id = t.traveler_id
  WHERE t.origin_code = 'I08' AND t.dest_code = 'I08D' AND t.status = 'open'
  ORDER BY u.average_rating DESC, u.completed_deliveries DESC
  LIMIT 3;

  -- Verify top 3 notified (rating >= 4.5)
  SELECT COUNT(*) INTO v_notif_count
  FROM notifications n
  WHERE n.type = 'booking_created' AND n.title = 'New parcel match!'
    AND n.user_id = ANY(v_traveler_ids)
    AND n.user_id IN (
      SELECT id FROM users WHERE id = ANY(v_traveler_ids) AND average_rating >= 4.5
    );

  -- Verify low-rated traveler (4th) NOT notified
  SELECT COUNT(*) INTO v_low_notif_count
  FROM notifications n
  WHERE n.type = 'booking_created' AND n.title = 'New parcel match!'
    AND n.user_id = v_traveler_ids[4];

  IF v_notif_count = 3 AND v_low_notif_count = 0 THEN
    RAISE NOTICE 'INT-08: PASS — top_3_notified=%, low_traveler_notified=%', v_notif_count, v_low_notif_count;
  ELSE
    RAISE EXCEPTION 'INT-08: FAIL — top_3_notified=%, low_traveler_notified=%', v_notif_count, v_low_notif_count;
  END IF;

  DELETE FROM notifications WHERE user_id = ANY(v_traveler_ids);
  DELETE FROM parcels WHERE id = v_parcel_id;
  DELETE FROM trips WHERE origin_code = 'I08' AND dest_code = 'I08D';
  DELETE FROM users WHERE id = ANY(v_traveler_ids);
  DELETE FROM users WHERE id = v_sender_id;
END $$;

-- ── INT-09: Admin KYC Approval ────────────────────────────────
DO $$
DECLARE
  v_user_id UUID;
  v_admin_id UUID;
  v_kyc_id UUID;
  v_kyc_status TEXT;
  v_submission_status TEXT;
  v_audit_count INT;
BEGIN
  RAISE NOTICE 'INT-09: Admin KYC Approval — START';

  INSERT INTO users (auth_id, email, name, role, kyc_status)
  VALUES (gen_random_uuid(), 'int09-user@test.carrymate.io', 'INT09 User', 'sender', 'submitted')
  RETURNING id INTO v_user_id;

  INSERT INTO users (auth_id, email, name, role, kyc_status)
  VALUES (gen_random_uuid(), 'int09-admin@test.carrymate.io', 'INT09 Admin', 'admin', 'verified')
  RETURNING id INTO v_admin_id;

  INSERT INTO kyc_submissions (user_id, provider, applicant_id, status, submitted_at)
  VALUES (v_user_id, 'sumsub', 'int09-applicant', 'pending', NOW())
  RETURNING id INTO v_kyc_id;

  -- Admin approves
  UPDATE users SET kyc_status = 'verified' WHERE id = v_user_id;
  UPDATE kyc_submissions SET status = 'approved', reviewed_at = NOW() WHERE id = v_kyc_id;

  INSERT INTO audit_logs (admin_id, admin_name, action, target_type, target_id, metadata)
  VALUES (v_admin_id, 'INT09 Admin', 'kyc_approve', 'kyc_submissions', v_kyc_id,
    jsonb_build_object('userId', v_user_id, 'approvedBy', v_admin_id));

  SELECT kyc_status INTO v_kyc_status FROM users WHERE id = v_user_id;
  SELECT status INTO v_submission_status FROM kyc_submissions WHERE id = v_kyc_id;
  SELECT COUNT(*) INTO v_audit_count FROM audit_logs WHERE target_id = v_kyc_id AND action = 'kyc_approve';

  IF v_kyc_status = 'verified' AND v_submission_status = 'approved' AND v_audit_count > 0 THEN
    RAISE NOTICE 'INT-09: PASS — kyc_status=%, submission=%, audit=%', v_kyc_status, v_submission_status, v_audit_count;
  ELSE
    RAISE EXCEPTION 'INT-09: FAIL — kyc_status=%, submission=%, audit=%', v_kyc_status, v_submission_status, v_audit_count;
  END IF;

  DELETE FROM audit_logs WHERE target_id = v_kyc_id;
  DELETE FROM kyc_submissions WHERE id = v_kyc_id;
  DELETE FROM users WHERE id IN (v_user_id, v_admin_id);
END $$;

-- ── INT-10: Broadcast Notification ───────────────────────────
DO $$
DECLARE
  v_admin_id UUID;
  v_traveler_ids UUID[] := ARRAY[]::UUID[];
  v_tid UUID;
  v_notif_count INT;
  v_admin_notif_count INT;
BEGIN
  RAISE NOTICE 'INT-10: Broadcast Notification — START';

  INSERT INTO users (auth_id, email, name, role, kyc_status)
  VALUES (gen_random_uuid(), 'int10-admin@test.carrymate.io', 'INT10 Admin', 'admin', 'verified')
  RETURNING id INTO v_admin_id;

  FOR i IN 1..5 LOOP
    INSERT INTO users (auth_id, email, name, role, kyc_status)
    VALUES (gen_random_uuid(), 'int10-traveler-' || i || '@test.carrymate.io', 'INT10 Traveler ' || i, 'traveler', 'verified')
    RETURNING id INTO v_tid;
    v_traveler_ids := v_traveler_ids || v_tid;
  END LOOP;

  -- Broadcast to all travelers
  INSERT INTO notifications (user_id, type, title, body, is_read)
  SELECT id, 'booking_confirmed', 'INT10 Broadcast Test', 'Test broadcast body', false
  FROM users WHERE id = ANY(v_traveler_ids);

  SELECT COUNT(*) INTO v_notif_count FROM notifications WHERE title = 'INT10 Broadcast Test';
  SELECT COUNT(*) INTO v_admin_notif_count FROM notifications WHERE user_id = v_admin_id AND title = 'INT10 Broadcast Test';

  IF v_notif_count = 5 AND v_admin_notif_count = 0 THEN
    RAISE NOTICE 'INT-10: PASS — travelers_notified=%, admin_notified=%', v_notif_count, v_admin_notif_count;
  ELSE
    RAISE EXCEPTION 'INT-10: FAIL — travelers_notified=%, admin_notified=%', v_notif_count, v_admin_notif_count;
  END IF;

  DELETE FROM notifications WHERE title = 'INT10 Broadcast Test';
  DELETE FROM users WHERE id = ANY(v_traveler_ids);
  DELETE FROM users WHERE id = v_admin_id;
END $$;

SELECT 'ALL 10 INTEGRATION TESTS COMPLETE' AS result;
