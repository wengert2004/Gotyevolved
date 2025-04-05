using UnityEngine;
using UnityEngine.EventSystems;
using System.Collections;

public class ClawController : MonoBehaviour, IPointerDownHandler, IPointerUpHandler
{
    [Header("Claw Setup")]
    public Transform clawBase;         // Main claw root (horizontal mover)
    public float maxDropDistance = 5;  // How far down the claw drops
    public Vector3 startPosition;      // Where it resets to
    public float moveSpeed = 2f;
    public float dropSpeed = 3f;
    public Transform leftClaw;
    public Transform rightClaw;
    public bool collisionTriggerClose = false;

    [Header("Claw Joints")]
    public HingeJoint2D leftClawJoint;
    public HingeJoint2D rightClawJoint;

    [Header("Motor Settings")]
    public float clawMotorSpeed = 150f;
    public float clawMotorTorque = 1000f;

    private bool isPressed = false;
    private bool isRunningSequence = false;

    void Start()
    {
        startPosition = clawBase.transform.position;
    }

    // These are the ones you'll call from EventTrigger
    public void PressClawButton()
    {
        isPressed = true;
        collisionTriggerClose = false;
    }

    public void ReleaseClawButton()
    {
        isPressed = false;
        if (!isRunningSequence)
        {
            StartCoroutine(ClawSequence());
        }
    }

    public void OnPointerDown(PointerEventData eventData) => PressClawButton();
    public void OnPointerUp(PointerEventData eventData) => ReleaseClawButton();

    void Update()
    {
        if (isPressed && !isRunningSequence)
        {
            clawBase.position += Vector3.left * moveSpeed * Time.deltaTime;
        }
    }

    IEnumerator ClawSequence()
    {
        isRunningSequence = true;

        // 1. Drop claw
        Vector3 liftToPosition = clawBase.position;
        liftToPosition.y = startPosition.y;
        float droppedDistance = 0;
        while (droppedDistance < maxDropDistance && !collisionTriggerClose)
        {
            droppedDistance += Time.deltaTime * dropSpeed;
            clawBase.position += Vector3.down * dropSpeed * Time.deltaTime;
            yield return null;
        }

        // 2. Close claws
        CloseClaws();
        yield return new WaitForSeconds(0.5f);

        // 3. Lift claw
        while (Vector3.Distance(clawBase.position, liftToPosition) > 0.01f)
        {
            clawBase.position = Vector3.MoveTowards(clawBase.position, liftToPosition, dropSpeed * Time.deltaTime);
            yield return null;
        }

        // 4. Move back to start X position
        while (Vector3.Distance(clawBase.position, startPosition) > 0.01f)
        {
            clawBase.position = Vector3.MoveTowards(clawBase.position, startPosition, moveSpeed * Time.deltaTime);
            yield return null;
        }

        // 5. Open claws
        OpenClaws();
        yield return new WaitForSeconds(0.5f);

        isRunningSequence = false;
    }

    void CloseClaws()
    {
        SetClawMotor(leftClawJoint, -clawMotorSpeed);   // Rotate inwards
        SetClawMotor(rightClawJoint, clawMotorSpeed);   // Rotate inwards
        StartCoroutine(StopClawsAfter(0.5f));
    }

    void OpenClaws()
    {
        SetClawMotor(leftClawJoint, clawMotorSpeed);    // Rotate outwards
        SetClawMotor(rightClawJoint, -clawMotorSpeed);  // Rotate outwards
        StartCoroutine(StopClawsAfter(0.5f));
    }

    void SetClawMotor(HingeJoint2D joint, float speed)
    {
        var motor = joint.motor;
        motor.motorSpeed = speed;
        motor.maxMotorTorque = clawMotorTorque;
        joint.motor = motor;
        joint.useMotor = true;
    }

    IEnumerator StopClawsAfter(float delay)
    {
        yield return new WaitForSeconds(delay);
        //leftClawJoint.useMotor = false;
        //rightClawJoint.useMotor = false;
    }
}
