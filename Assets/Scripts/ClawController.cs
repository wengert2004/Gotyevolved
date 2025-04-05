using UnityEngine;
using UnityEngine.EventSystems;
using System.Collections;
public class ClawController : MonoBehaviour, IPointerDownHandler, IPointerUpHandler
{
    [Header("Claw Setup")]
    public Transform clawBase;         // Main claw root (horizontal mover)
    public float maxDropDistance = 5;       // How far down the claw drops
    public Vector3 startPosition;    // Where it resets to
    public float moveSpeed = 2f;
    public float dropSpeed = 3f;
    public Transform leftClaw;
    public Transform rightClaw;
    public bool collisionTriggerClose = false;
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
        //Vector3 dropPos = new Vector3(clawBase.position.x, maxDropDistance.position.y, clawBase.position.z);

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
        // Example: rotate inwards
        leftClaw.localRotation = Quaternion.Euler(0, 0, 15);
        rightClaw.localRotation = Quaternion.Euler(0, 0, -15);
    }

    void OpenClaws()
    {
        // Example: reset to open state
        leftClaw.localRotation = Quaternion.Euler(0, 0, -50);
        rightClaw.localRotation = Quaternion.Euler(0, 0, 50);
    }
}
